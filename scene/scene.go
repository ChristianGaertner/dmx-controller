package scene

import (
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Scene struct {
	Sequence       []*Step
	DefaultTimings Timings
}

func New(sequence []*Step, duration, fadeUp, fadeDown time.Duration) *Scene {
	return &Scene{
		Sequence: sequence,
		DefaultTimings: Timings{
			Duration: &duration,
			FadeUp:   &fadeUp,
			FadeDown: &fadeDown,
		},
	}
}

func (s *Scene) Eval(tc types.TimeCode) {
	step := int(tc / types.TimeCode(*s.DefaultTimings.Duration))
	s.Sequence[step].Eval()
}

func (s *Scene) ComputeStepTimings() {
	duration := time.Duration(0)
	for _, step := range s.Sequence {
		if step.Timings.Duration != nil {
			duration += *step.Timings.Duration
		} else {
			duration += *s.DefaultTimings.Duration
		}
	}
}
