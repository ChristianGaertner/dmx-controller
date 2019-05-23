package scene

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

func Run(ctx context.Context, scene *Scene, devices *fixture.DeviceMap, globalTimeCode <-chan types.TimeCode, onEval chan<- bool) {
	ctx, cancel := context.WithCancel(ctx)
	defer func() {
		err := recover()
		if err != nil {
			cancel()
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
			scene.Eval(tc, devices)
			onEval <- true
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
