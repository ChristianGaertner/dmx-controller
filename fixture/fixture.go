package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Fixture interface {
	NumChannels() uint16
	ApplyValueTo(value *Value, d *Device)
}

type DefinedFixture struct {
	Definition *definition.Definition
	ActiveMode definition.ModeID
}

func (f DefinedFixture) NumChannels() uint16 {
	return f.Definition.Modes[f.ActiveMode].NumChannels
}

func (f DefinedFixture) ApplyValueTo(value *Value, d *Device) {
	mode := f.Definition.Modes[f.ActiveMode]

	if capa, ok := mode.Capabilities[definition.IntensityMasterDimmer]; value.Dimmer != nil && ok {
		set(d, float64(*value.Dimmer), capa)
	}

	color := value.Color
	if color != nil && mode.HasVirtualDimmer {
		var dimmer float64
		if value.Dimmer != nil {
			dimmer = float64(*value.Dimmer)
		}
		color = types.LerpColor(color, &types.Color{}, dimmer, dimmer)
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

	if capa, ok := mode.Capabilities[definition.StrobeSlowToFast]; value.Strobe != nil && ok {
		set(d, float64(*value.Strobe), capa)
	}
}

func set(d *Device, value float64, capa definition.Capability) {
	d.Set(capa.Channel, capa.MapValue(value))
}
