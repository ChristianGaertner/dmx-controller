package scene

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

func Run(ctx context.Context, scene *Scene, timeCode <-chan types.TimeCode, onEval chan<- bool) {
	numSteps := len(scene.Sequence)
	step := 0
	for {
		select {
		case tc := <-timeCode:
			scene.Eval(tc)
			onEval <- true
		case <-ctx.Done():
			return
		}
		step = (step + 1) % numSteps
	}
}

type Ticker struct {
	timeTicker       *time.Ticker
	TimeCode         <-chan types.TimeCode
	t                chan types.TimeCode
	tickerResolution time.Duration
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
			tc += types.TimeCode(t.tickerResolution)
		}
	}
}

func (t *Ticker) Stop() {
	t.timeTicker.Stop()
	close(t.t)
}
