package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Value struct {
	Dimmer  *types.DimmerValue `json:"dimmer,omitempty"`
	Color   *types.Color       `json:"color,omitempty"`
	Shutter *types.Shutter     `json:"shutter"`
	Preset  *types.PresetID    `json:"preset,omitempty"`

	Generic map[types.GenericID]types.DimmerValue `json:"generic,omitempty"`
}

func Lerp(a, b *Value, percentUp, percentDown float64) *Value {
	if a == nil {
		a = new(Value)
	}
	if b == nil {
		b = new(Value)
	}

	return &Value{
		Dimmer:  types.LerpDimmerValue(a.Dimmer, b.Dimmer, percentUp, percentDown),
		Color:   types.LerpColor(a.Color, b.Color, percentUp, percentDown),
		Shutter: types.LerpShutter(a.Shutter, b.Shutter, percentUp, percentDown),
		Preset:  types.LerpPreset(a.Preset, b.Preset, percentUp, percentDown),
		Generic: lerpGeneric(a.Generic, b.Generic, percentUp, percentDown),
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

	var shutter *types.Shutter
	if a.Shutter != nil && b.Shutter == nil {
		shutter = a.Shutter
	} else if a.Color != nil && b.Color != nil {
		shutter = types.LerpShutter(a.Shutter, b.Shutter, 0.5, 0.5)
	} else {
		shutter = b.Shutter
	}

	var preset *types.PresetID
	if a.Preset != nil && b.Preset == nil {
		preset = a.Preset
	} else if a.Preset != nil && b.Preset != nil {
		preset = types.LerpPreset(a.Preset, b.Preset, 0.5, 0.5)
	} else {
		preset = b.Preset
	}

	var generic map[types.GenericID]types.DimmerValue
	if a.Generic != nil && b.Generic == nil {
		generic = a.Generic
	} else if a.Generic != nil && b.Generic != nil {
		generic = lerpGeneric(a.Generic, b.Generic, 0.5, 0.5)
	} else {
		generic = b.Generic
	}

	return &Value{
		Dimmer:  dimmer,
		Color:   color,
		Shutter: shutter,
		Preset:  preset,
		Generic: generic,
	}
}

func lerpGeneric(a, b map[types.GenericID]types.DimmerValue, percentUp, percentDown float64) map[types.GenericID]types.DimmerValue {
	if a == nil && b == nil {
		return nil
	}

	var ids []types.GenericID

	for v := range a {
		ids = append(ids, v)
	}
	for v := range b {
		ids = append(ids, v)
	}

	lerped := make(map[types.GenericID]types.DimmerValue)

	for _, id := range ids {
		va := a[id]
		vb := b[id]
		lerped[id] = *types.LerpDimmerValue(&va, &vb, percentUp, percentDown)
	}

	return lerped
}
