package run

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/database"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/metronom"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/setup"
	"github.com/ChristianGaertner/dmx-controller/system"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Engine struct {
	Db database.Database

	metronom         metronom.Metronom
	active           map[string]*SceneRun
	defaultRunParams SceneRunParams

	Renderer     dmx.BufferRenderer
	Setup        *setup.Setup
	DeviceMap    *setup.DeviceMap
	Buffer       *dmx.Buffer
	StatsMonitor system.StatsMonitor

	runScene  chan SceneRun
	stopScene chan string

	registerClient   chan EngineClient
	unregisterClient chan EngineClient
	clients          map[EngineClient]bool

	setRunParams chan SceneRunParams
}

type EngineClient interface {
	OnProgressChange(progress map[string]float64) bool
}

func (e *Engine) onProgressChange(progress map[string]float64) {
	for c := range e.clients {
		if ok := c.OnProgressChange(progress); !ok {
			delete(e.clients, c)
		}
	}
}

func NewEngine(renderer dmx.BufferRenderer, setup *setup.Setup, deviceMap *setup.DeviceMap, buffer *dmx.Buffer, db database.Database) *Engine {
	return &Engine{
		Db:               db,
		metronom:         metronom.New(),
		active:           make(map[string]*SceneRun),
		Renderer:         renderer,
		Setup:            setup,
		DeviceMap:        deviceMap,
		Buffer:           buffer,
		StatsMonitor:     system.NewStatsMonitor(),
		runScene:         make(chan SceneRun),
		stopScene:        make(chan string),
		registerClient:   make(chan EngineClient),
		unregisterClient: make(chan EngineClient),
		clients:          make(map[EngineClient]bool),
		setRunParams:     make(chan SceneRunParams),
		defaultRunParams: SceneRunParams{
			Mode: types.RunModeCycle,
			Type: UseStepTimings,
		},
	}
}

func (e *Engine) Register(c EngineClient) {
	e.registerClient <- c
}

func (e *Engine) Unregister(c EngineClient) {
	e.unregisterClient <- c
}

func (e *Engine) Boot(ctx context.Context, onExit chan<- bool) {

	go e.StatsMonitor.StartDaemon(ctx)
	go e.metronom.Start(ctx)
	go e.Buffer.Render(ctx, e.Renderer, onExit)

	progress := make(map[string]float64)

	for {
		select {
		case tc := <-e.metronom.Tick():
			for id, active := range e.active {
				if done := active.Step(e.metronom); done {
					delete(e.active, id)
					delete(progress, id)
				} else {
					out := active.eval(tc)
					for id, val := range out {
						e.DeviceMap.Get(id).Fixture.ApplyValueTo(val, e.DeviceMap.Get(id))
					}
					progress[id] = active.GetProgress(e.metronom)
				}
			}
			e.DeviceMap.Render(e.Buffer)

			e.onProgressChange(progress)

		case r := <-e.runScene:
			r.activeSince = e.metronom.TimeCode()
			r.stepInfo.ActiveSince = e.metronom.TimeCode()
			e.active[r.scene.ID] = &r
		case id := <-e.stopScene:
			delete(e.active, id)
		case p := <-e.setRunParams:
			e.defaultRunParams = p
			for _, active := range e.active {
				active.params = p
			}
		case c := <-e.registerClient:
			e.clients[c] = true
		case c := <-e.unregisterClient:
			delete(e.clients, c)
		case <-ctx.Done():
			return
		}
	}
}

func (e *Engine) Run(scene *scene.Scene) {
	e.runScene <- SceneRun{scene: scene, params: e.defaultRunParams}
}

func (e *Engine) Stop(sceneID string) {
	e.stopScene <- sceneID
}

func (e *Engine) SetRunParams(params SceneRunParams) {
	e.setRunParams <- params
}

func (e *Engine) PreviewStep(step *scene.Step) {
	meta := scene.Meta{
		ID:   "PREVIEW/" + step.ID,
		Name: "PREVIEW/" + step.ID,
	}
	tmp := scene.New(meta, []*scene.Step{step}, 1, 0, 0)
	e.runScene <- SceneRun{scene: tmp, params: SceneRunParams{
		Type: UseStepTimings,
		Mode: types.RunModeOneShotHold,
	}}
}
