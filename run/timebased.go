package run

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

func runTimebased(ctx context.Context, scene *scene.Scene, devices *fixture.DeviceMap, onEval chan<- bool, onExit chan<- bool) {
	ctx, cancel := context.WithCancel(ctx)
	defer func() {
		cancel()
		onExit <- true
		err := recover()
		if err != nil {
			fmt.Printf("Error Running Scene '%s': %s\n", scene.ID, err)
		}
	}()

	ticker := newTicker()
	go ticker.Run(ctx)

	for {
		select {
		case tc := <-ticker.TimeCode:

			out, done := scene.Eval(tc, types.RunModeCycle)

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

type rateticker struct {
	timeTicker       *time.Ticker
	TimeCode         <-chan types.TimeCode
	t                chan types.TimeCode
	tickerResolution time.Duration
	Rate             float64
}

func newTicker() *rateticker {
	tickerResolution := 50 * time.Millisecond
	ticker := time.NewTicker(tickerResolution)

	ch := make(chan types.TimeCode)

	return &rateticker{
		timeTicker:       ticker,
		TimeCode:         ch,
		t:                ch,
		tickerResolution: tickerResolution,
		Rate:             1,
	}
}

func (t *rateticker) Run(ctx context.Context) {
	var tc types.TimeCode
	for {
		select {
		case <-ctx.Done():
			t.timeTicker.Stop()
			return
		case <-t.timeTicker.C:
			t.t <- tc
			tc += types.TimeCode(t.Rate * float64(t.tickerResolution))
		}
	}
}

func (t *rateticker) Stop() {
	t.timeTicker.Stop()
	close(t.t)
}
