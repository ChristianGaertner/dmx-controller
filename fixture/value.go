package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Value struct {
	Dimmer *types.DimmerValue
	Color  *types.Color
	Strobe *types.Frequency
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
