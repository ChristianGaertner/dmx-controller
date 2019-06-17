package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"github.com/ChristianGaertner/dmx-controller/types"
	"math"
)

type Fixture interface {
	GetDefinition() *DefinedFixture
	NumChannels() uint16
	ApplyValueTo(value *Value, d *Device)
}

type DefinedFixture struct {
	Definition *definition.Definition `json:"definition"`
	ActiveMode definition.ModeID `json:"activeMode"`
}

func (f DefinedFixture) GetDefinition() *DefinedFixture {
	return &f
}

func (f DefinedFixture) NumChannels() uint16 {
	return f.Definition.Modes[f.ActiveMode].NumChannels
}

func (f DefinedFixture) ApplyValueTo(value *Value, d *Device) {
	mode := f.Definition.Modes[f.ActiveMode]

	if capa, ok := mode.Capabilities[definition.IntensityMasterDimmer]; value.Dimmer != nil && ok {
		set(d, float64(*value.Dimmer), capa)
	}

	f.applyColor(value.Dimmer, value.Color, d)

	if capa, ok := mode.Capabilities[definition.StrobeSlowToFast]; value.Strobe != nil && ok {
		set(d, float64(*value.Strobe), capa)
	}
}

func set(d *Device, value float64, capa definition.ChannelTargetRange) {
	d.Set(capa.Channel, capa.MapValue(value))
}

func (f DefinedFixture) applyColor(dimmer *types.DimmerValue, color *types.Color, d *Device) {
	mode := f.Definition.Modes[f.ActiveMode]
	if color != nil && mode.HasVirtualDimmer {
		var dVal float64
		if dimmer != nil {
			dVal = float64(*dimmer)
		}
		color = &types.Color{
			R: math.Min(color.R, dVal),
			G: math.Min(color.G, dVal),
			B: math.Min(color.B, dVal),
		}
	}

	// if we have color macros, use them
	if len(mode.ColorMacros) > 0 {
		var closestMacro *definition.ColorMacroDefinition
		distance := math.Inf(1)
		for _, macro := range mode.ColorMacros {
			d := types.ColorDistance(color, &macro.Color)
			if d < distance {
				distance = d
				m := macro // we cannot take the address of the loop variable...
				closestMacro = &m
			}
		}
		if closestMacro != nil {
			d.Set(closestMacro.Target.Channel, closestMacro.Target.RangeStart)
		}
		return
	}

	if capa, ok := mode.Capabilities[definition.IntensityRed]; color != nil && ok {
		set(d, color.R, capa)
	}
	if capa, ok := mode.Capabilities[definition.IntensityGreen]; color != nil && ok {
		set(d, color.G, capa)
	}
	if capa, ok := mode.Capabilities[definition.IntensityBlue]; color != nil && ok {
		set(d, color.B, capa)
	}
}
