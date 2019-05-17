package definition

import "github.com/ChristianGaertner/dmx-controller/dmx"

type ModeID uint32

type CapabilityType int

const (
	IntensityMasterDimmer CapabilityType = iota
	IntensityRed
	IntensityGreen
	IntensityBlue

	StrobeSlowToFast
)

type Modes map[ModeID]Mode

type Definition struct {
	Modes map[ModeID]Mode
}

type Mode struct {
	NumChannels  uint16
	Capabilities map[CapabilityType]Capability
}

type Capability struct {
	Channel    dmx.Channel
	RangeStart dmx.Value
	RangeEnd   dmx.Value
}

// MapValue converts any given input value [0..1] to a dmx value [0..255]
// but mapped into the capability range of the given channel.
// e.g. the channel 1 of a fixture as IntensityRed from 0..99, IntensityGreen 100..199, etc.
// then calling MapValue with 0.5 (50% green), this functions return dmx.Value(150)
func (c *Capability) MapValue(value float64) dmx.Value {
	return dmx.Value(value*float64(c.RangeEnd-c.RangeStart) + float64(c.RangeStart))
}

func NewSingleValueChannel(c dmx.Channel) Capability {
	return Capability{
		Channel:    c,
		RangeStart: 0,
		RangeEnd:   255,
	}
}
