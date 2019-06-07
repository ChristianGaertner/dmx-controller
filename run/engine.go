package run

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/database"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type RunnerID string

type Type int

const (
	UseStepTimings Type = iota
)

type SceneRun struct {
	scene *scene.Scene
	typ   Type
	mode  types.RunMode

	stop chan bool
}

type Engine struct {
	Db     database.Database
	active *SceneRun

	Renderer  dmx.BufferRenderer
	DeviceMap *fixture.DeviceMap
	Buffer    *dmx.Buffer

	runScene  chan SceneRun
	stopScene chan bool

	registerClient   chan EngineClient
	unregisterClient chan EngineClient
	clients          map[EngineClient]bool

	setRunMode chan types.RunMode
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

func NewEngine(renderer dmx.BufferRenderer, deviceMap *fixture.DeviceMap, buffer *dmx.Buffer, db database.Database) *Engine {
	return &Engine{
		Db:               db,
		Renderer:         renderer,
		DeviceMap:        deviceMap,
		Buffer:           buffer,
		runScene:         make(chan SceneRun),
		stopScene:        make(chan bool),
		registerClient:   make(chan EngineClient),
		unregisterClient: make(chan EngineClient),
		clients:          make(map[EngineClient]bool),
		setRunMode:       make(chan types.RunMode),
	}
}

func (e *Engine) Register(c EngineClient) {
	e.registerClient <- c
}

func (e *Engine) Unregister(c EngineClient) {
	e.unregisterClient <- c
}

func (e *Engine) Boot(ctx context.Context, onExit chan<- bool) {

	onEval := make(chan bool)

	go e.DeviceMap.RenderLoop(ctx, onEval, e.Buffer)
	go e.Buffer.Render(ctx, e.Renderer, onExit)

	for {
		select {
		case r := <-e.runScene:
			r.stop = make(chan bool)
			ctx, cancel := context.WithCancel(ctx)
			onFinish := make(chan bool)
			e.active = &r

			go e.runTimebased(ctx, r.scene, onEval, onFinish)
			go func() {
				// wait for finish or stop signal
				select {
				case <-onFinish:
				case <-r.stop:
				}

				e.active = nil
				close(r.stop)
				cancel()
				// wait for finish of scene
				<-onFinish
			}()
		case <-e.stopScene:
			if e.active != nil {
				e.active.stop <- true
			}
		case c := <-e.registerClient:
			e.clients[c] = true
		case c := <-e.unregisterClient:
			delete(e.clients, c)
		case <-ctx.Done():
			close(e.stopScene)
			close(e.runScene)
			return
		default:
		}
	}
}

func (e *Engine) Run(scene *scene.Scene, typ Type, mode types.RunMode) {
	e.Stop()
	e.runScene <- SceneRun{scene: scene, typ: typ, mode: mode}
}

func (e *Engine) Stop() {
	e.stopScene <- true
}

func (e *Engine) SetRunMode(runMode types.RunMode) {
	select {
	case e.setRunMode <- runMode:
	default:
		fmt.Println("NP")
	}
}
