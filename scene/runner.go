package scene

import (
	"context"
	"time"
)

func Run(ctx context.Context, scene *Scene, stepTicker <-chan time.Time, onEval chan<- bool) {
	numSteps := len(scene.Sequence)
	step := 0
	for {
		select {
		case <-stepTicker:
			scene.Eval(step)
			onEval <- true
		case <-ctx.Done():
			return
		}
		step = (step + 1) % numSteps
	}
}

type dynamicTicker struct {
	C     <-chan time.Time
	c     chan time.Time
	stop  chan<- bool
	delay time.Duration
}

func NewDynamicTicker(initialDuration time.Duration) *dynamicTicker {
	c := make(chan time.Time)
	return &dynamicTicker{
		delay: initialDuration,
		stop:  make(chan bool),
		C:     c,
		c:     c,
	}
}

func (d *dynamicTicker) Run(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		default:
			d.c <- time.Now()
			time.Sleep(d.delay)
		}
	}
}

func (d *dynamicTicker) SetDelay(dur time.Duration) {
	d.delay = dur
}
