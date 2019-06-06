package dmx

import (
	"context"
	"sync"
	"time"
)

const UniverseSize = uint16(512)

type Value = byte

type Buffer struct {
	sync.RWMutex
	channels []Value
}

type BufferRenderer interface {
	Boot(ctx context.Context) error
	Render(ctx context.Context, buffer *Buffer) error
	GetTicker(ctx context.Context) *time.Ticker
}

func NewBuffer() *Buffer {
	return &Buffer{
		channels: make([]Value, UniverseSize),
	}
}

func (b *Buffer) Apply(channel Channel, values []Value) {
	b.Lock()
	defer b.Unlock()
	copy(b.channels[channel.ToSliceIndex():], values)
}

func (b *Buffer) Render(ctx context.Context, renderer BufferRenderer, onExit chan<- bool) {
	err := renderer.Boot(ctx)
	if err != nil {
		// TODO handle error in a better way?
		panic(err)
	}
	ticker := renderer.GetTicker(ctx)

	for {
		select {
		case <-ticker.C:
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
}
