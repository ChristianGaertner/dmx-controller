package run

import (
	"context"
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
	active *SceneRun

	Renderer  dmx.BufferRenderer
	DeviceMap *fixture.DeviceMap
	Buffer    *dmx.Buffer

	runScene  chan SceneRun
	stopScene chan bool
}

func NewEngine(renderer dmx.BufferRenderer, deviceMap *fixture.DeviceMap, buffer *dmx.Buffer) *Engine {
	return &Engine{
		Renderer:  renderer,
		DeviceMap: deviceMap,
		Buffer:    buffer,
		runScene:  make(chan SceneRun),
		stopScene: make(chan bool),
	}
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

			go runTimebased(ctx, r.scene, e.DeviceMap, onEval, onFinish)
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
