package dmx

import (
	"context"
	"fmt"
	"time"
)

type StdOutRenderer struct {
	NumChannels uint16
}

func (s *StdOutRenderer) Render(ctx context.Context, buffer *Buffer) {
	fmt.Print("\033[H\033[2J")
	for channel := uint16(0); channel < s.NumChannels; channel++ {
		value := buffer.channels[channel]
		fmt.Printf("%03d: %03d %s\n", channel+1, int(value), getBar(value))
	}
}

func (s *StdOutRenderer) GetTicker(ctx context.Context) *time.Ticker {
	return time.NewTicker(25 * time.Millisecond)
}

func getBar(value Value) string {
	percent := float64(value) / float64(255)
	bar := "["

	for i := float64(0); i < 10; i++ {
		if i < percent*10 {
			bar += "="
		} else {
			bar += " "
		}
	}

	return bar + "]"
}

type NilRenderer struct{}

func (s *NilRenderer) Render(ctx context.Context, buffer *Buffer) {
}

func (s *NilRenderer) GetTicker(ctx context.Context) *time.Ticker {
	return time.NewTicker(25 * time.Second)
}
