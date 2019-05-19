package definition

import (
	"fmt"
)

type CapabilityType int

const (
	IntensityMasterDimmer CapabilityType = iota
	IntensityRed
	IntensityGreen
	IntensityBlue

	StrobeSlowToFast
)

func (t CapabilityType) MarshalText() ([]byte, error) {
	var s string
	switch t {
	case IntensityMasterDimmer:
		s = "IntensityMasterDimmer"
	case IntensityRed:
		s = "IntensityRed"
	case IntensityGreen:
		s = "IntensityGreen"
	case IntensityBlue:
		s = "IntensityBlue"
	case StrobeSlowToFast:
		s = "StrobeSlowToFast"
	}

	return []byte(s), nil
}

func (t *CapabilityType) UnmarshalText(data []byte) error {
	s := string(data)
	switch s {
	case "IntensityMasterDimmer":
		*t = IntensityMasterDimmer
	case "IntensityRed":
		*t = IntensityRed
	case "IntensityGreen":
		*t = IntensityGreen
	case "IntensityBlue":
		*t = IntensityBlue
	case "StrobeSlowToFast":
		*t = StrobeSlowToFast
	default:
		return fmt.Errorf("CapabilityType '%s' does not exist", s)
	}

	return nil
}
