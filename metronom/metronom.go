package metronom

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Metronom interface {
	Start(ctx context.Context)
	Stop()

	TimeCode() types.TimeCode

	Tick() <-chan types.TimeCode
}

type metronom struct {
	timeTicker       *time.Ticker
	tc               types.TimeCode
	t                chan types.TimeCode
	tickerResolution time.Duration
}

func New() Metronom {
	tickerResolution := 50 * time.Millisecond
	ticker := time.NewTicker(tickerResolution)

	t := make(chan types.TimeCode)

	return &metronom{
		timeTicker:       ticker,
		t:                t,
		tickerResolution: tickerResolution,
	}
}

func (m *metronom) Start(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			m.timeTicker.Stop()
			return
		case <-m.timeTicker.C:
			m.t <- m.tc
			m.tc += types.TimeCode(float64(m.tickerResolution))
		}
	}
}

func (m *metronom) Stop() {
	m.timeTicker.Stop()
	close(m.t)
}

func (m *metronom) TimeCode() types.TimeCode {
	return m.tc
}

func (m *metronom) Tick() <-chan types.TimeCode {
	return m.t
}