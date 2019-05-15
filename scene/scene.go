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
	var sequence []*sequencedStep

	var prevEnd types.TimeCode
	for _, step := range steps {

		timings := computeTimings(step, sceneTimings)

		end := prevEnd + types.TimeCode(*timings.Duration)

		sequence = append(sequence, &sequencedStep{
			Step:    step,
			Start:   prevEnd,
			End:     end,
			Timings: timings,
		})

		prevEnd = end
	}

	return sequence
}

func computeTimings(step *Step, sceneTimings Timings) Timings {
	getDuration := func(step *Step) *time.Duration {
		if step.Timings.Duration != nil {
			return step.Timings.Duration
		}

		return sceneTimings.Duration
	}

	getFadeUp := func(step *Step) *time.Duration {
		if step.Timings.FadeUp != nil {
			return step.Timings.FadeUp
		}
		return sceneTimings.FadeUp
	}

	getFadeDown := func(step *Step) *time.Duration {
		if step.Timings.FadeDown != nil {
			return step.Timings.FadeDown
		}

		return getFadeUp(step)
	}

	return Timings{
		Duration: getDuration(step),
		FadeUp:   getFadeUp(step),
		FadeDown: getFadeDown(step),
	}
}
