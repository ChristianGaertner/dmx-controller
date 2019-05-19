package main

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"io/ioutil"
	"time"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	buffer := dmx.NewBuffer()
	renderer := &dmx.StdOutRenderer{NumChannels: 10}
	//renderer := &dmx.NilRenderer{}
	//renderer, err := dmx.NewEnttecRenderer()
	//if err != nil {
	//	panic(err)
	//}

	onExit := make(chan bool)

	data, err := ioutil.ReadFile("./test-fixture.json")
	if err != nil {
		panic(err)
	}

	def, err := definition.FromJson(data)
	if err != nil {
		panic(err)
	}

	generic := fixture.DefinedFixture{
		ActiveMode: 0,
		Definition: def,
	}

	devA := fixture.NewDevice(generic)
	devB := fixture.NewDevice(generic)

	deviceMap := fixture.NewDeviceMap()
	deviceMap.Place(dmx.NewChannel(1), devA)
	deviceMap.Place(dmx.NewChannel(6), devB)

	d := 3 * time.Second

	sequence := []*scene.Step{
		//{
		//	Values: map[*fixture.Device]fixture.FixtureValue{
		//		devA: {
		//			Dimmer: types.NewDimmerValue(1),
		//			Color: &types.Color{
		//				R: 1, G: 0, B: 0,
		//			},
		//		},
		//		devB: {
		//			Dimmer: types.NewDimmerValue(1),
		//			Color: &types.Color{
		//				R: 1, G: 0, B: 0,
		//			},
		//		},
		//	},
		//},
		//{
		//	Values: map[*fixture.Device]fixture.FixtureValue{
		//		devA: {
		//			Dimmer: types.NewDimmerValue(1),
		//			Color: &types.Color{
		//				R: 0, G: 1, B: 0,
		//			},
		//		},
		//		devB: {
		//			Dimmer: types.NewDimmerValue(1),
		//			Color: &types.Color{
		//				R: 0, G: 1, B: 0,
		//			},
		//		},
		//	},
		//},
		{
			Timings: scene.Timings{
				Duration: &d,
			},
			Effects: []scene.Effect{
				&scene.DimmerSine{
					Devices: []*fixture.Device{
						devA, devB,
					},
					Phase: -0.5,
					Speed: types.BPM(60),
					Min:   0.5,
					Max:   1,
				},
			},
			Values: map[*fixture.Device]fixture.Value{
				devA: {
					Color: &types.Color{
						R: 1, G: 1, B: 1,
					},
				},
				devB: {
					Color: &types.Color{
						R: 1, G: 1, B: 1,
					},
				},
			},
		},
		{
			Timings: scene.Timings{
				Duration: &d,
			},
			Effects: []scene.Effect{
				&scene.DimmerSine{
					Devices: []*fixture.Device{
						devA, devB,
					},
					Phase: -0.5,
					Speed: types.BPM(60),
					Min:   0.5,
					Max:   1,
				},
			},
			Values: map[*fixture.Device]fixture.Value{
				devA: {
					Color: &types.Color{
						R: 1, G: 1, B: 1,
					},
				},
				devB: {
					Color: &types.Color{
						R: 1, G: 1, B: 1,
					},
				},
			},
		},
	}

	myScene := scene.New(sequence, 1500*time.Millisecond, 500*time.Millisecond, 500*time.Millisecond)

	ticker := scene.NewTicker()

	onEval := make(chan bool)
	go deviceMap.RenderLoop(ctx, onEval, buffer)
	go buffer.Render(ctx, renderer, onExit)
	go ticker.Run(ctx)

	sceneCtx, cancelScene := context.WithCancel(ctx)

	go scene.Run(sceneCtx, myScene, ticker.TimeCode, onEval)

	var res string
	for {
		_, _ = fmt.Scanln(&res)

		if res == "+" {
			ticker.Rate *= 2
		}

		if res == "-" {
			ticker.Rate /= 2
		}

		if res == "stop" {
			cancelScene()
			deviceMap.Reset()
			onEval <- true
		}

		if res == "start" {
			sceneCtx, cancelScene = context.WithCancel(ctx)
			go scene.Run(sceneCtx, myScene, ticker.TimeCode, onEval)
		}

		if res == "exit" {
			break
		}
	}

	cancel()
	<-onExit
}
