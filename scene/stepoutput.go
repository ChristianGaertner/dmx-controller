package scene

import "github.com/ChristianGaertner/dmx-controller/fixture"

type StepOutput map[fixture.DeviceIdentifier]*fixture.Value

func HTPMergeStepOutput(outs ...StepOutput) StepOutput {
	merged := make(StepOutput)

	for _, o := range outs {
		for dev, fix := range o {
			if existing, ok := merged[dev]; ok {
				merged[dev] = fixture.HTPMerge(existing, fix)
			} else {
				merged[dev] = fix
			}
		}
	}

	return merged
}
