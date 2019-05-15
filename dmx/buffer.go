package dmx

import (
	"context"
	"sync"
	"time"
)

const UniverseSize = uint16(512)

type Value byte

type Buffer struct {
	sync.RWMutex
	channels []Value
}

type BufferRenderer interface {
	Render(ctx context.Context, buffer *Buffer)
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
	ticker := renderer.GetTicker(ctx)

	for {
		select {
		case <-ticker.C:
			b.RLock()
			renderer.Render(ctx, b)
			b.RUnlock()
		case <-ctx.Done():
			ticker.Stop()
			onExit <- true
			return
		}
	}
}
