package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
	"math"
)

type Effect interface {
	Generate(tc types.TimeCode) StepOutput
}

type DimmerSine struct {
	Devices []*fixture.Device
	Min     types.DimmerValue
	Max     types.DimmerValue
	Phase   float64 // 0 = all in sync 1 = no overlap
	Speed   types.BPM
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

		value := float64(ds.Min) + sin * float64(ds.Max - ds.Min)


		output[dev] = fixture.Value{
			Dimmer: types.NewDimmerValue(value),
		}
	}

	return output
}
