package definition

import (
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/types"
	"io/ioutil"
)

type ModeID uint32

type Modes map[ModeID]Mode

type Definition struct {
	ID    string          `json:"id"`
	Modes map[ModeID]Mode `json:"modes"`
}

func Load(id string) (*Definition, error) {
	data, err := ioutil.ReadFile("./resources/fixtures/" + id + ".json")
	if err != nil {
		return nil, fmt.Errorf("cannot read fixture definition file: %e", err)
	}

	def, err := FromJson(data)
	if err != nil {
		return nil, fmt.Errorf("cannot parse fixture definition file: %e", err)
	}

	return def, nil
}

func FromJson(data []byte) (*Definition, error) {
	def := Definition{}
	err := json.Unmarshal(data, &def)

	return &def, err
}

type Mode struct {
	NumChannels      uint16                                `json:"numChannels"`
	Capabilities     map[CapabilityType]ChannelTargetRange `json:"capabilities"`
	Presets          map[types.PresetID]Preset             `json:"presets"`
	ColorMacros      []ColorMacroDefinition                `json:"colorMacros"`
	HasVirtualDimmer bool                                  `json:"hasVirtualDimmer"`
}

type ChannelTargetRange struct {
	Channel    dmx.Channel `json:"channel"`
	RangeStart dmx.Value   `json:"rangeStart"`
	RangeEnd   dmx.Value   `json:"rangeEnd"`
}

type Preset struct {
	Name    string             `json:"name"`
	Default bool               `json:"default"`
	Target  ChannelTargetRange `json:"target"`
}

type ColorMacroDefinition struct {
	Color  types.Color        `json:"color"`
	Name   string             `json:"name"`
	Target ChannelTargetRange `json:"target"`
}

// MapValue converts any given input value [0..1] to a dmx value [0..255]
// but mapped into the capability range of the given channel.
// e.g. the channel 1 of a fixture as IntensityRed from 0..99, IntensityGreen 100..199, etc.
// then calling MapValue with 0.5 (50% green), this functions return dmx.Value(150)
func (c *ChannelTargetRange) MapValue(value float64) dmx.Value {
	return dmx.Value(value*float64(c.RangeEnd-c.RangeStart) + float64(c.RangeStart))
}
