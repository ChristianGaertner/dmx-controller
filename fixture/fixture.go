package fixture

import "github.com/ChristianGaertner/dmx-controller/dmx"

type Fixture interface {
	NumChannels() uint16
	ApplyValueTo(value *Value, d *Device)
}

type ledParFixture struct {
	numChannels uint16
}

func LedParFixture() Fixture {
	return ledParFixture{numChannels: 5}
}

func (l ledParFixture) NumChannels() uint16 {
	return l.numChannels
}

func (l ledParFixture) ApplyValueTo(value *Value, d *Device) {
	if value.Dimmer != nil {
		d.Set(dmx.NewChannel(1), dmx.Value(*value.Dimmer*255))
	}
	if value.Color != nil {
		d.Set(dmx.NewChannel(2), dmx.Value(value.Color.R*255))
		d.Set(dmx.NewChannel(3), dmx.Value(value.Color.G*255))
		d.Set(dmx.NewChannel(4), dmx.Value(value.Color.B*255))
	}
	if value.Strobe != nil {
		d.Set(dmx.NewChannel(5), dmx.Value(float64(*value.Strobe)*255))
	}
}
