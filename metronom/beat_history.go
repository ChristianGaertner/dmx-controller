package metronom

import (
	"github.com/ChristianGaertner/dmx-controller/types"
	"sync"
)

// beatHistory implements a circular buffer to store the timecodes
// of all beats.
type beatHistory struct {
	sync.RWMutex
	beats       []types.TimeCode
	size        uint32
	writeCursor uint32
}

func newBeatHistory(size uint32) *beatHistory {
	return &beatHistory{
		size:  size,
		beats: make([]types.TimeCode, size),
	}
}

func (b *beatHistory) Record(tc types.TimeCode) {
	b.beats[b.writeCursor] = tc
	b.writeCursor = (b.writeCursor + 1) % b.size
}

func (b *beatHistory) BeatsSince(tc types.TimeCode) int {
	n := 0
	for _, beatTc := range b.beats {
		if beatTc > tc {
			n++
		}
	}
	return n
}
