package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"github.com/ChristianGaertner/dmx-controller/scene"
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
	deviceMap.Place(dmx.NewChannel(1), devA)
	deviceMap.Place(dmx.NewChannel(6), devB)

	devicePool := fixture.PoolFromDeviceMap(deviceMap)

	sceneData, err := ioutil.ReadFile("./test-scene.json")
	if err != nil {
		panic(err)
	}
	var myScene scene.Scene
	err = json.Unmarshal(sceneData, &myScene)
	if err != nil {
		panic(err)
	}

	ticker := scene.NewTicker()

	onEval := make(chan bool)
	go deviceMap.RenderLoop(ctx, onEval, buffer)
	go buffer.Render(ctx, renderer, onExit)
	go ticker.Run(ctx)

	sceneCtx, cancelScene := context.WithCancel(ctx)

	go scene.Run(sceneCtx, &myScene, devicePool, ticker.TimeCode, onEval)

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
			go scene.Run(sceneCtx, &myScene, devicePool, ticker.TimeCode, onEval)
		}

		if res == "exit" {
			break
		}
	}

	cancel()
	<-onExit

	j, err := myScene.MarshalJSON()
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s", j)
}
