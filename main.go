package main

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	buffer := dmx.NewBuffer()
	renderer := dmx.StdOutRenderer{NumChannels: 8}
	//renderer := dmx.NilRenderer{}

	onExit := make(chan bool)

	devA := fixture.NewDevice(4)
	devB := fixture.NewDevice(4)

	fixA := &fixture.Fixture{Device: devA}
	fixB := &fixture.Fixture{Device: devB}

	deviceMap := fixture.NewDeviceMap()
	deviceMap.Place(dmx.NewChannel(1), devA)
	deviceMap.Place(dmx.NewChannel(5), devB)

	cD := 3 * time.Second
	sequence := []*scene.Step{
		{
			Timings: scene.Timings{
				Duration: &cD,
			},
			Effects: map[*fixture.Fixture][]scene.Effect{
				fixA: {
					&scene.ColorEffect{
						Color: types.Color{
							R: 1, G: 0, B: 1,
						},
					}, &scene.StrobeEffect{
						Frequency: 0.5,
					},
				},
				fixB: {
					&scene.ColorEffect{
						Color: types.Color{
							R: 1, G: 1, B: 1,
						},
					},
				},
			},
		},
		{
			Effects: map[*fixture.Fixture][]scene.Effect{
				fixA: {
					&scene.ColorEffect{
						Color: types.Color{
							R: 0, G: 1, B: 0,
						},
					},
				},
				fixB: {
					&scene.StrobeEffect{
						Frequency: 1,
					},
				},
			},
		},
		{
			Effects: map[*fixture.Fixture][]scene.Effect{
				fixB: {
					&scene.ColorEffect{
						Color: types.Color{
							R: 1, G: 0, B: 1,
						},
					},
				},
			},
		},
		{
			Effects: map[*fixture.Fixture][]scene.Effect{
				fixA: {
					&scene.ColorEffect{
						Color: types.Color{
							R: 1, G: 1, B: 1,
						},
					}, &scene.StrobeEffect{
						Frequency: 0.5,
					},
				},
				fixB: {
					&scene.ColorEffect{
						Color: types.Color{
							R: 1, G: 0, B: 1,
						},
					},
				},
			},
		},
	}

	myScene := scene.New(sequence, 1500*time.Millisecond, 0, 0)

	ticker := scene.NewTicker()

	onEval := make(chan bool)
	go scene.Run(ctx, myScene, ticker.TimeCode, onEval)
	go deviceMap.RenderLoop(ctx, onEval, buffer)
	go buffer.Render(ctx, &renderer, onExit)

	ticker.Run(ctx)

	cancel()
	<-onExit
}
