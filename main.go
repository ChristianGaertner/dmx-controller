package main

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/server"
	"io/ioutil"
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

	genericA := fixture.DefinedFixture{
		ActiveMode: 0,
		Definition: def,
	}
	genericB := fixture.DefinedFixture{
		ActiveMode: 1,
		Definition: def,
	}

	devA := fixture.NewDevice("devA", genericA)
	devB := fixture.NewDevice("devB", genericB)

	deviceMap := fixture.NewDeviceMap()
	deviceMap.Patch(dmx.NewChannel(1), devA)
	deviceMap.Patch(dmx.NewChannel(6), devB)

	ticker := scene.NewTicker()

	onEval := make(chan bool)
	go deviceMap.RenderLoop(ctx, onEval, buffer)
	go buffer.Render(ctx, renderer, onExit)
	go ticker.Run(ctx)

	err = server.ListenAndServe(ctx, deviceMap, ticker.TimeCode, onEval)
	fmt.Println(err)

	fmt.Println("Shutting down...")
	cancel()
	<-onExit
	fmt.Println("[SHUTDOWN]")
}
