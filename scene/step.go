package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Step struct {
	Values  StepOutput
	Effects []Effect
	Timings Timings
}

type sequencedStep struct {
	Step    *Step
	Start   types.TimeCode
	End     types.TimeCode
	Timings Timings
}

func (s *sequencedStep) Eval(tc types.TimeCode, prev *sequencedStep) {
	percentUp := calcPercent(tc, *s.Timings.FadeUp)
	percentDown := calcPercent(tc, *s.Timings.FadeDown)

	fxOutput := s.Step.applyEffects(tc)
	fxOutput = append(fxOutput, s.Step.Values)

	stepOutput := MergeStepOutput(fxOutput...)

	for dev, fix := range stepOutput {
		var fixPrev fixture.Fixture
		if prev != nil {
			if p, ok := prev.Step.Values[dev]; ok {
				fixPrev = p
			}
		}

		fixture.Lerp(&fixPrev, &fix, percentUp, percentDown).ApplyTo(dev)
	}
}

func (s *Step) applyEffects(tc types.TimeCode) []StepOutput {
	var out []StepOutput
	for _, fx := range s.Effects {
		out = append(out, fx.Generate(tc))
	}
	return out
}

func calcPercent(tc types.TimeCode, d time.Duration) float64 {
	p := float64(1)

	if d > 0 {
		p = float64(tc) / float64(d)
	}

	if p > 1 {
		p = 1
	}

	return p
}

func (s *sequencedStep) FadeDuration() int64 {
	if *s.Timings.FadeDown > *s.Timings.FadeUp {
		return int64(*s.Timings.FadeDown)
	}

	return int64(*s.Timings.FadeUp)
}
