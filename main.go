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

	deviceMap := fixture.NewDeviceMap()
	deviceMap.Place(dmx.NewChannel(1), devA)
	deviceMap.Place(dmx.NewChannel(5), devB)

	sequence := []*scene.Step{
		{
			Values: map[*fixture.Device]fixture.Fixture{
				devA: {
					Color: types.Color{
						R: 1, G: 0, B: 0,
					},
				},
				devB: {
					Color: types.Color{
						R: 1, G: 0, B: 0,
					},
				},
			},
		},
		{
			Values: map[*fixture.Device]fixture.Fixture{
				devA: {
					Color: types.Color{
						R: 0, G: 1, B: 0,
					},
				},
				devB: {
					Color: types.Color{
						R: 0, G: 1, B: 0,
					},
				},
			},
		},
		{
			Values: map[*fixture.Device]fixture.Fixture{
				devA: {
					Color: types.Color{
						R: 0, G: 0, B: 1,
					},
				},
				devB: {
					Color: types.Color{
						R: 0, G: 0, B: 1,
					},
				},
			},
		},
		{
			Values: map[*fixture.Device]fixture.Fixture{
				devA: {
					Strobe: 1,
				},
				devB: {
					Strobe: 1,
				},
			},
		},
	}

	myScene := scene.New(sequence, 1500*time.Millisecond, 500*time.Millisecond, 500*time.Millisecond)

	ticker := scene.NewTicker()

	onEval := make(chan bool)
	go scene.Run(ctx, myScene, ticker.TimeCode, onEval)
	go deviceMap.RenderLoop(ctx, onEval, buffer)
	go buffer.Render(ctx, &renderer, onExit)

	ticker.Run(ctx)

	cancel()
	<-onExit
}
