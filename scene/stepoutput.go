package scene

import "github.com/ChristianGaertner/dmx-controller/fixture"

type StepOutput map[*fixture.Device]fixture.Fixture

func MergeStepOutput(outs ...StepOutput) StepOutput {
	merged := make(StepOutput)

	for _, o := range outs {
		for dev, fix := range o {
			if existing, ok := merged[dev]; ok {
				merged[dev] = *fixture.Merge(&existing, &fix)
			} else {
				merged[dev] = fix
			}
		}
	}

	return merged
}
