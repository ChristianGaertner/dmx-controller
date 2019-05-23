package scene

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type RunMode int

const (
	OneShot RunMode = iota
	OneShotHold
	Cycle
)

func Run(ctx context.Context, scene *Scene, devices *fixture.DeviceMap, globalTimeCode <-chan types.TimeCode, onEval chan<- bool, onExit chan<- bool) {
	ctx, cancel := context.WithCancel(ctx)
	defer func() {
		cancel()
		onExit <- true
		err := recover()
		if err != nil {
			fmt.Printf("Error Running Scene '%s': %s\n", scene.ID, err)
		}
	}()
	initTc := <-globalTimeCode

	timeCode := make(chan types.TimeCode)

	go func() {
		for {
			select {
			case tc := <-globalTimeCode:
				timeCode <- tc - initTc
			case <-ctx.Done():
				return
			}
		}
	}()

	for {
		select {
		case tc := <-timeCode:

			out, done := scene.Eval(tc, OneShotHold)

			for id, val := range out {
				devices.Get(id).Fixture.ApplyValueTo(val, devices.Get(id))
			}

			onEval <- true
			if done {
				return
			}
		case <-ctx.Done():
			onEval <- true
			return
		}
	}
}

type Ticker struct {
	timeTicker       *time.Ticker
	TimeCode         <-chan types.TimeCode
	t                chan types.TimeCode
	tickerResolution time.Duration
	Rate             float64
}

func NewTicker() *Ticker {
	tickerResolution := 50 * time.Millisecond
	ticker := time.NewTicker(tickerResolution)

	ch := make(chan types.TimeCode)

	return &Ticker{
		timeTicker:       ticker,
		TimeCode:         ch,
		t:                ch,
		tickerResolution: tickerResolution,
		Rate:             1,
	}
}

func (t *Ticker) Run(ctx context.Context) {
	var tc types.TimeCode
	for {
		select {
		case <-ctx.Done():
			return
		case <-t.timeTicker.C:
			t.t <- tc
			tc += types.TimeCode(t.Rate * float64(t.tickerResolution))
		}
	}
}

func (t *Ticker) Stop() {
	t.timeTicker.Stop()
	close(t.t)
}
