package scene

import (
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Scene struct {
	defaultTimings Timings
	sequence       []*sequencedStep
}

func New(sequence []*Step, duration, fadeUp, fadeDown time.Duration) *Scene {
	timings := Timings{
		Duration: &duration,
		FadeUp:   &fadeUp,
		FadeDown: &fadeDown,
	}
	return &Scene{
		sequence:       computeSequence(sequence, timings),
		defaultTimings: timings,
	}
}

func (s *Scene) Eval(tc types.TimeCode) {
	for _, step := range s.sequence {
		if step.Start <= tc && step.End >= tc {
			step.Step.Eval()
			return
		}
	}
}

func (s *Scene) Duration() time.Duration {
	return time.Duration(s.sequence[len(s.sequence)-1].End)
}

func computeSequence(steps []*Step, sceneTimings Timings) []*sequencedStep {

	getDuration := func(step *Step) time.Duration {
		if step.Timings.Duration != nil {
			return *step.Timings.Duration
		}

		return *sceneTimings.Duration
	}

	var sequence []*sequencedStep

	var prevEnd types.TimeCode
	for _, step := range steps {
		end := prevEnd + types.TimeCode(getDuration(step))
		sequence = append(sequence, &sequencedStep{
			Step:  step,
			Start: prevEnd,
			End:   end,
		})

		prevEnd = end
	}

	return sequence
}
