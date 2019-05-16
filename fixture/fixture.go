package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
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
	// TODO
	return 5
}

func (f DefinedFixture) ApplyValueTo(value *Value, d *Device) {
	mode := f.Definition.Modes[f.ActiveMode]

	if capa, ok := mode.Channels[definition.IntensityMasterDimmer]; value.Dimmer != nil && ok {
		set(d, float64(*value.Dimmer), capa)
	}

	if capa, ok := mode.Channels[definition.IntensityRed]; value.Color != nil && ok {
		set(d, value.Color.R, capa)
	}
	if capa, ok := mode.Channels[definition.IntensityGreen]; value.Color != nil && ok {
		set(d, value.Color.G, capa)
	}
	if capa, ok := mode.Channels[definition.IntensityBlue]; value.Color != nil && ok {
		set(d, value.Color.B, capa)
	}

	if capa, ok := mode.Channels[definition.StrobeSlowToFast]; value.Strobe != nil && ok {
		set(d, float64(*value.Strobe), capa)
	}
}

func set(d *Device, value float64, capa definition.Capability) {
	d.Set(capa.Channel, capa.MapValue(value))
}