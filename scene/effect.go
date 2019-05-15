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
	Phase   float64 // 0 = all in sync 1 = no overlap
	Speed   types.BPM
}

func (ds *DimmerSine) Generate(tc types.TimeCode) StepOutput {
	output := make(StepOutput)

	f := 0.3

	for i, dev := range ds.Devices {

		t := tc + types.TimeCode(i*int(ds.Phase))



		output[dev] = fixture.Fixture{
			Dimmer: types.NewDimmerValue(math.Sin(float64(t)*f+0)*0.5 + 0.5),
		}
	}

	return output
}
