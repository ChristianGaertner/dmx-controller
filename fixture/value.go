package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Value struct {
	Dimmer *types.DimmerValue
	Color  *types.Color
	Strobe *types.Frequency
}

func (f *Value) ApplyTo(d *Device) {
	if f.Dimmer != nil {
		d.Set(dmx.NewChannel(1), dmx.Value(*f.Dimmer*255))
	}
	if f.Color != nil {
		d.Set(dmx.NewChannel(2), dmx.Value(f.Color.R*255))
		d.Set(dmx.NewChannel(3), dmx.Value(f.Color.G*255))
		d.Set(dmx.NewChannel(4), dmx.Value(f.Color.B*255))
	}

	if f.Strobe != nil {
		d.Set(dmx.NewChannel(5), dmx.Value(float64(*f.Strobe)*255))
	}
}

func Lerp(a, b *Value, percentUp, percentDown float64) *Value {
	return &Value{
		Dimmer: types.LerpDimmerValue(a.Dimmer, b.Dimmer, percentUp, percentDown),
		Color:  types.LerpColor(a.Color, b.Color, percentUp, percentDown),
		Strobe: types.LerpFrequency(a.Strobe, b.Strobe, percentUp, percentDown),
	}
}

func Merge(a, b *Value) *Value {

	var dimmer *types.DimmerValue
	if a.Dimmer != nil && b.Dimmer == nil {
		dimmer = a.Dimmer
	} else if a.Dimmer != nil && b.Dimmer != nil {
		dimmer = types.LerpDimmerValue(a.Dimmer, b.Dimmer, 0.5, 0.5)
	} else {
		dimmer = b.Dimmer
	}

	var color *types.Color
	if a.Color != nil && b.Color == nil {
		color = a.Color
	} else if a.Color != nil && b.Color != nil {
		color = types.LerpColor(a.Color, b.Color, 0.5, 0.5)
	} else {
		color = b.Color
	}

	var strobe *types.Frequency
	if a.Strobe != nil && b.Strobe == nil {
		strobe = a.Strobe
	} else if a.Color != nil && b.Color != nil {
		strobe = types.LerpFrequency(a.Strobe, b.Strobe, 0.5, 0.5)
	} else {
		strobe = b.Strobe
	}

	return &Value{
		Dimmer: dimmer,
		Color:  color,
		Strobe: strobe,
	}
}
