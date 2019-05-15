package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Fixture struct {
	Color  types.Color
	Strobe types.Frequency
}

func (f *Fixture) ApplyTo(d *Device) {
	d.Set(dmx.NewChannel(1), byte(f.Color.R*255))
	d.Set(dmx.NewChannel(2), byte(f.Color.G*255))
	d.Set(dmx.NewChannel(3), byte(f.Color.B*255))

	d.Set(dmx.NewChannel(4), byte(float64(f.Strobe)*255))
}

func Lerp(a, b *Fixture, percentUp, percentDown float64) *Fixture {
	return &Fixture{
		Color:  types.LerpColor(a.Color, b.Color, percentUp, percentDown),
		Strobe: types.LerpFrequency(a.Strobe, b.Strobe, percentUp, percentDown),
	}
}
