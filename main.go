package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/ChristianGaertner/dmx-controller/server"
	"github.com/ChristianGaertner/dmx-controller/setup"
)

var olaRpcEndpoint = flag.String("ola_rpc_endpoint", "localhost:9010", "RPC endpoint of the OLA service")
var addr = flag.String("address", ":8080", "Address of the server to listen on")
var setupFile = flag.String("setup", "", "path to setup json definition")

func main() {
	flag.Parse()
	if *setupFile == "" {
		fmt.Println("Please provide a setup file, e.g.: -setup file.json")
		return
	}

	buffer := dmx.NewBuffer()
	//renderer := &dmx.StdOutRenderer{NumChannels: 10}
	//renderer := &dmx.NilRenderer{}
	//renderer, err := dmx.NewEnttecRenderer()
	renderer, err := dmx.NewOlaRPCRenderer(*olaRpcEndpoint)
	if err != nil {
		panic(err)
	}

	s, err := setup.Load(*setupFile)
	if err != nil {
		panic(err)
	}

	buffer.Init(s.GetUniverseIds())

	deviceMap := fixture.NewDeviceMap()
	err = s.PatchDeviceMap(deviceMap)
	if err != nil {
		panic(err)
	}

	engine := run.NewEngine(renderer, deviceMap, buffer)

	onExit := make(chan bool)
	ctx, cancel := context.WithCancel(context.Background())
	go engine.Boot(ctx, onExit)

	err = server.ListenAndServe(*addr, engine)
	fmt.Println(err)

	fmt.Println("Shutting down...")
	cancel()
	<-onExit
	fmt.Println("[SHUTDOWN]")
}
