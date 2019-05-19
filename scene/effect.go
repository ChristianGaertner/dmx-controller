package scene

import (
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
	"math"
)

type Effect interface {
	Generate(tc types.TimeCode) StepOutput
}

type EffectType uint32

const (
	DimmerSineType EffectType = iota
)

func (t EffectType) MarshalText() ([]byte, error) {
	var s string
	switch t {
	case DimmerSineType:
		s = "DimmerSineType"
	}

	return []byte(s), nil
}

func (t *EffectType) UnmarshalText(data []byte) error {
	s := string(data)
	switch s {
	case "DimmerSineType":
		*t = DimmerSineType
	default:
		return fmt.Errorf("EffectType '%s' does not exist", s)
	}

	return nil
}

type DimmerSine struct {
	Type    EffectType                 `json:"type"`
	Devices []fixture.DeviceIdentifier `json:"devices"`
	Min     types.DimmerValue          `json:"min"`
	Max     types.DimmerValue          `json:"max"`
	Phase   float64                    `json:"phase"` // 0 = all in sync 1 = no overlap
	Speed   types.BPM                  `json:"speed"`
}

func (ds *DimmerSine) Generate(tc types.TimeCode) StepOutput {
	output := make(StepOutput)

	phaseOffset := math.Pi * 2 * ds.Phase / float64(len(ds.Devices))

	for i, dev := range ds.Devices {

		scaled := (float64(tc) / float64(ds.Speed.AsDuration())) * math.Pi * 2

		sin := math.Sin(scaled + phaseOffset*float64(i))

		if sin < 0 {
			sin = 0
		}

		value := float64(ds.Min) + sin*float64(ds.Max-ds.Min)

		output[dev] = fixture.Value{
			Dimmer: types.NewDimmerValue(value),
		}
	}

	return output
}
