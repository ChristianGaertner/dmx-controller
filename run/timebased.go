package run

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"math"
	"time"
)

func (e *Engine) runTimebased(ctx context.Context, scene *scene.Scene, onEval chan<- bool, onExit chan<- bool) {
	defer func() {
		e.onActiveChange(nil, 0)
		onExit <- true
		err := recover()
		if err != nil {
			fmt.Printf("Error Running Scene '%s': %s\n", scene.ID, err)
		}
	}()

	ticker := newTicker()
	go ticker.Run(ctx)

	getStepTimeCode := func(tc types.TimeCode, runMode types.RunMode) (types.TimeCode, bool) {
		duration := types.TimeCode(scene.Duration())

		switch runMode {
		case types.RunModeOneShot:
			return tc, tc > duration
		case types.RunModeOneShotHold:
			if tc > duration {
				return duration, false
			}
			return tc, false
		case types.RunModeCycle:
			return tc % duration, false
		}
		panic("RunMode not recognized")
	}

	stepInfo := stepInfo{}

	var prevProgress float64

	for {
		select {
		case tc := <-ticker.TimeCode:
			stepTimeCode, done := getStepTimeCode(tc, e.active.params.RunMode)
			stepIndex, ok := scene.GetStepIndexAt(stepTimeCode)
			stepInfo.Supply(stepIndex, tc)

			progress := float64(stepTimeCode) / float64(scene.Duration())
			if diff := math.Abs(progress - prevProgress); diff > 1e-2 {
				prevProgress = progress
				e.onActiveChange(&scene.ID, progress)
			}

			if !ok {
				done = true
			} else {
				out := scene.Eval(tc, time.Duration(tc-stepInfo.activeSince), stepInfo.active, stepInfo.prev)

				// render
				for id, val := range out {
					e.DeviceMap.Get(id).Fixture.ApplyValueTo(val, e.DeviceMap.Get(id))
				}
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

type stepInfo struct {
	prev        int
	active      int
	activeSince types.TimeCode
}

func (si *stepInfo) Supply(stepIndex int, tc types.TimeCode) {
	if stepIndex != si.active {
		si.prev = si.active
		si.active = stepIndex
		si.activeSince = tc
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
