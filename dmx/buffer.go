package dmx

import (
	"context"
	"sync"
	"time"
)

const UniverseSize = uint16(512)

type Value = byte

type UniverseId uint32

type PatchPosition uint64

func NewPatchPosition(universe UniverseId, address Channel) PatchPosition {
	return PatchPosition(uint64(universe)<<32 | uint64(address.ToSliceIndex()))
}

func (p PatchPosition) GetAddress() Channel {
	return NewChannelFromIndex(int(p & 0xffffffff))
}

func (p PatchPosition) GetUniverseId() UniverseId {
	return UniverseId(p >> 32)
}

type Buffer struct {
	sync.RWMutex
	universes map[UniverseId][]Value
}

type BufferRenderer interface {
	Boot(ctx context.Context) error
	Render(ctx context.Context, buffer *Buffer) error
	GetTicker(ctx context.Context) *time.Ticker
}

func NewBuffer() *Buffer {
	return &Buffer{
		universes: make(map[UniverseId][]Value),
	}
}

func (b *Buffer) Init(universeIds []UniverseId) {
	for _, id := range universeIds {
		b.universes[id] = make([]Value, UniverseSize)
	}
}

func (b *Buffer) Apply(p PatchPosition, values []Value) {
	b.Lock()
	defer b.Unlock()
	addr := p.GetAddress()
	copy(b.universes[p.GetUniverseId()][addr.ToSliceIndex():], values)
}

func (b *Buffer) Render(ctx context.Context, renderer BufferRenderer, onExit chan<- bool) <-chan chan bool {
	done := make(chan chan bool)
	err := renderer.Boot(ctx)
	if err != nil {
		// TODO handle error in a better way?
		panic(err)
	}
	ticker := renderer.GetTicker(ctx)

	go func() {
		for {
			select {
			case <-ticker.C:
				wait := make(chan bool)
				done <- wait
				// TODO maybe add a timeout here??
				<-wait

				b.RLock()
				err := renderer.Render(ctx, b)
				if err != nil {
					// TODO handle error in a better way?
					panic(err)
				}
				b.RUnlock()
			case <-ctx.Done():
				ticker.Stop()
				onExit <- true
				return
			}
		}
	}()
	return done
}
