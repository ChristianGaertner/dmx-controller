package run

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/database"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/metronom"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/setup"
	"github.com/ChristianGaertner/dmx-controller/types"
	"math"
)

type Engine struct {
	Db database.Database

	metronom         metronom.Metronom
	active           *SceneRun
	defaultRunParams SceneRunParams

	Renderer  dmx.BufferRenderer
	Setup     *setup.Setup
	DeviceMap *setup.DeviceMap
	Buffer    *dmx.Buffer

	runScene  chan SceneRun
	stopScene chan bool

	registerClient   chan EngineClient
	unregisterClient chan EngineClient
	clients          map[EngineClient]bool

	setRunParams chan SceneRunParams
}

type EngineClient interface {
	OnActiveChange(sceneID *string, progress float64) bool
}

func (e *Engine) onActiveChange(sceneID *string, progress float64) {
	for c := range e.clients {
		if ok := c.OnActiveChange(sceneID, progress); !ok {
			delete(e.clients, c)
		}
	}
}

func NewEngine(renderer dmx.BufferRenderer, setup *setup.Setup, deviceMap *setup.DeviceMap, buffer *dmx.Buffer, db database.Database) *Engine {
	return &Engine{
		Db:               db,
		metronom:         metronom.New(),
		Renderer:         renderer,
		Setup:            setup,
		DeviceMap:        deviceMap,
		Buffer:           buffer,
		runScene:         make(chan SceneRun),
		stopScene:        make(chan bool),
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

	go e.metronom.Start(ctx)
	go e.Buffer.Render(ctx, e.Renderer, onExit)

	prevProgress := float64(0)
	for {
		select {
		case <-e.metronom.Tick():
			done := e.active.Step(e.metronom)
			if done {
				if e.active != nil {
					e.active = nil
					e.DeviceMap.Render(e.Buffer)
					e.onActiveChange(nil, 0)
				}
			} else {
				// render
				out := e.active.eval(e.metronom.TimeCode())
				for id, val := range out {
					e.DeviceMap.Get(id).Fixture.ApplyValueTo(val, e.DeviceMap.Get(id))
				}

				e.DeviceMap.Render(e.Buffer)

				progress := float64(e.active.stepInfo.Active) / float64(e.active.scene.NumSteps())
				if diff := math.Abs(progress - prevProgress); diff > 1e-2 {
					prevProgress = progress
					e.onActiveChange(&e.active.scene.ID, progress)
				}

			}
		case r := <-e.runScene:
			e.active = &r
		case <-e.stopScene:
			e.active = nil
			e.DeviceMap.Render(e.Buffer)
			e.onActiveChange(nil, 0)
		case p := <-e.setRunParams:
			e.defaultRunParams = p
			if e.active != nil {
				e.active.params = p
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

func (e *Engine) Stop() {
	e.stopScene <- true
}

func (e *Engine) SetRunParams(params SceneRunParams) {
	e.setRunParams <- params
}

func (e *Engine) PreviewStep(step *scene.Step) {
	tmp := scene.New("PREVIEW/"+step.ID, []*scene.Step{step}, 1, 0, 0)
	e.runScene <- SceneRun{scene: tmp, params: SceneRunParams{
		Type: UseStepTimings,
		Mode: types.RunModeOneShotHold,
	}}
}
