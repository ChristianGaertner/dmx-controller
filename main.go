package main

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	buffer := dmx.NewBuffer()
	renderer := dmx.StdOutRenderer{NumChannels: 10}
	//renderer := dmx.NilRenderer{}

	onExit := make(chan bool)

	generic := fixture.DefinedFixture{
		ActiveMode: 0,
		Definition: &definition.Definition{
			Modes: definition.Modes {
				0: definition.Mode{
					Channels: map[definition.ChannelType]definition.Capability {
						definition.IntensityMasterDimmer: definition.NewSingleValueChannel(dmx.NewChannel(1)),
						definition.IntensityRed: definition.NewSingleValueChannel(dmx.NewChannel(2)),
						definition.IntensityGreen: definition.NewSingleValueChannel(dmx.NewChannel(3)),
						definition.IntensityBlue: definition.NewSingleValueChannel(dmx.NewChannel(4)),
						definition.StrobeSlowToFast: definition.NewSingleValueChannel(dmx.NewChannel(5)),
					},
				},
			},
		},
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
					Min: 0.5,
					Max: 1,
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
					Min: 0.5,
					Max: 1,
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
	go buffer.Render(ctx, &renderer, onExit)
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
