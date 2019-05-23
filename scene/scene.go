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

func (s *Scene) Eval(tc types.TimeCode, runMode RunMode) (StepOutput, bool) {
	stepTimeCode, done := s.getStepTimeCode(tc, runMode)

	var prev *sequencedStep

	if runMode == Cycle {
		prev = s.sequence[len(s.sequence)-1]
	}

	for _, step := range s.sequence {
		if step.Start <= stepTimeCode && step.End >= stepTimeCode {
			return step.Eval(tc, time.Duration(stepTimeCode-step.Start), prev), done
		}
		prev = step
	}
	return NoStepOutput, done
}

func (s *Scene) getStepTimeCode(tc types.TimeCode, runMode RunMode) (types.TimeCode, bool) {
	duration := types.TimeCode(s.Duration())
	switch runMode {
	case OneShot:
		return tc, tc > duration
	case OneShotHold:
		if tc > duration {
			return duration, false
		}
		return tc, false
	case Cycle:
		return tc % duration, false
	}

	panic("RunMode not recognized")
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
