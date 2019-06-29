package metronom

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/types"
	"sync"
	"time"
)

type Metronom interface {
	Start(ctx context.Context)

	SetBPM(bpm types.BPM)
	GetBPM() types.BPM

	TimeCode() types.TimeCode
	BeatsSince(tc types.TimeCode) int

	Tick() <-chan types.TimeCode
}

type metronom struct {
	tcLock           sync.RWMutex
	timeTicker       *time.Ticker
	tc               types.TimeCode
	t                chan types.TimeCode
	tickerResolution time.Duration

	setBPM      chan types.BPM
	beat        types.BPM
	beatTicker  *time.Ticker
	beatHistory *beatHistory
}

func New(bpm types.BPM) Metronom {
	tickerResolution := 50 * time.Millisecond

	t := make(chan types.TimeCode)

	return &metronom{
		timeTicker:       time.NewTicker(tickerResolution),
		t:                t,
		tickerResolution: tickerResolution,

		setBPM:      make(chan types.BPM),
		beat:        bpm,
		beatTicker:  time.NewTicker(bpm.AsDuration()),
		beatHistory: newBeatHistory(100),
	}
}

func (m *metronom) Start(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			m.timeTicker.Stop()
			m.beatTicker.Stop()
			return
		case bpm := <-m.setBPM:
			m.beat = bpm
			m.beatTicker.Stop()
			m.beatTicker = time.NewTicker(m.beat.AsDuration())
		case <-m.timeTicker.C:
			m.t <- m.tc

			m.tcLock.Lock()
			m.tc += types.TimeCode(float64(m.tickerResolution))
			m.tcLock.Unlock()
		case <-m.beatTicker.C:
			m.tcLock.RLock()
			m.beatHistory.Lock()

			m.beatHistory.Record(m.tc)

			m.beatHistory.Unlock()
			m.tcLock.RUnlock()
		}
	}
}

func (m *metronom) SetBPM(bpm types.BPM) {
	m.setBPM <- bpm
}

func (m *metronom) GetBPM() types.BPM {
	return m.beat
}

func (m *metronom) TimeCode() types.TimeCode {
	m.tcLock.RLock()
	defer m.tcLock.RUnlock()
	return m.tc
}

func (m *metronom) BeatsSince(tc types.TimeCode) int {
	m.beatHistory.RLock()
	defer m.beatHistory.RUnlock()
	return m.beatHistory.BeatsSince(tc)
}

func (m *metronom) Tick() <-chan types.TimeCode {
	return m.t
}
