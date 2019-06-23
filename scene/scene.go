package scene

import (
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Scene struct {
	ID             string
	defaultTimings Timings
	sequence       []*sequencedStep
}

func New(id string, sequence []*Step, duration, fadeUp, fadeDown time.Duration) *Scene {
	timings := Timings{
		Duration: &duration,
		FadeUp:   &fadeUp,
		FadeDown: &fadeDown,
	}
	return &Scene{
		ID:             id,
		sequence:       computeSequence(sequence, timings),
		defaultTimings: timings,
	}
}

func (s *Scene) Eval(tc types.TimeCode, activeFor time.Duration, stepIndex, prevStepIndex int) StepOutput {
	var prev *sequencedStep
	if prevStepIndex >= 0 && prevStepIndex < len(s.sequence) {
		prev = s.sequence[prevStepIndex]
	}

	return s.sequence[stepIndex].Eval(tc, activeFor, prev)
}

func (s *Scene) GetStepIndexAt(tc types.TimeCode) (index int, ok bool) {
	for idx, step := range s.sequence {
		if step.Start <= tc && step.End >= tc {
			return idx, true
		}
	}

	return -1, false
}

func (s *Scene) GetStepAtIndex(idx int) *sequencedStep {
	return s.sequence[idx]
}

func (s *Scene) NumSteps() int {
	return len(s.sequence)
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

		if step.Timings.FadeUp != nil {
			return step.Timings.FadeUp
		}

		return sceneTimings.FadeDown
	}

	return Timings{
		Duration: getDuration(step),
		FadeUp:   getFadeUp(step),
		FadeDown: getFadeDown(step),
	}
}
