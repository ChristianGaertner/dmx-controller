package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Value struct {
	Dimmer *types.DimmerValue `json:"dimmer,omitempty"`
	Color  *types.Color       `json:"color,omitempty"`
	Strobe *types.Frequency   `json:"strobe,omitempty"`
	Preset *types.PresetID    `json:"preset,omitempty"`
}

func Lerp(a, b *Value, percentUp, percentDown float64) *Value {
	if a == nil {
		a = new(Value)
	}
	if b == nil {
		b = new(Value)
	}
	return &Value{
		Dimmer: types.LerpDimmerValue(a.Dimmer, b.Dimmer, percentUp, percentDown),
		Color:  types.LerpColor(a.Color, b.Color, percentUp, percentDown),
		Strobe: types.LerpFrequency(a.Strobe, b.Strobe, percentUp, percentDown),
		Preset: types.LerpPreset(a.Preset, b.Preset, percentUp, percentDown),
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

	var preset *types.PresetID
	if a.Preset != nil && b.Preset == nil {
		preset = a.Preset
	} else if a.Preset != nil && b.Preset != nil {
		preset = types.LerpPreset(a.Preset, b.Preset, 0.5, 0.5)
	} else {
		preset = b.Preset
	}

	return &Value{
		Dimmer: dimmer,
		Color:  color,
		Strobe: strobe,
		Preset: preset,
	}
}
