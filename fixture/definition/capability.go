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

	ShutterOpen
	ShutterClosed
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
	case ShutterOpen:
		s = "ShutterOpen"
	case ShutterClosed:
		s = "ShutterClosed"
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
	case "ShutterOpen":
		*t = ShutterOpen
	case "ShutterClosed":
		*t = ShutterClosed
	case "StrobeSlowToFast":
		*t = StrobeSlowToFast
	default:
		return fmt.Errorf("CapabilityType '%s' does not exist", s)
	}

	return nil
}
