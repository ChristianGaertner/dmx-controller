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

func HTPMerge(a, b *Value) *Value {
	if a == nil {
		a = new(Value)
	}
	if b == nil {
		b = new(Value)
	}

	return &Value{
		Dimmer:  types.MaxDimmerValue(a.Dimmer, b.Dimmer),
		Color:   types.MaxColor(a.Color, b.Color),
		Shutter: types.MaxShutter(a.Shutter, b.Shutter),
		Preset:  types.MaxPresetID(a.Preset, b.Preset),
		Generic: maxGeneric(a.Generic, b.Generic),
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

func maxGeneric(a, b map[types.GenericID]types.DimmerValue) map[types.GenericID]types.DimmerValue {
	if a == nil {
		return b
	}
	if b == nil {
		return a
	}

	var ids []types.GenericID

	for v := range a {
		ids = append(ids, v)
	}
	for v := range b {
		ids = append(ids, v)
	}

	maxed := make(map[types.GenericID]types.DimmerValue)

	for _, id := range ids {
		va := a[id]
		vb := b[id]
		maxed[id] = *types.MaxDimmerValue(&va, &vb)
	}

	return maxed
}
