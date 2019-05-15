package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Step struct {
	Values  map[*fixture.Device]fixture.Fixture
	Timings Timings
}

type sequencedStep struct {
	Step    *Step
	Start   types.TimeCode
	End     types.TimeCode
	Timings Timings
}

func (s *sequencedStep) Eval(t int64, prev *sequencedStep) {
	if t > s.FadeDuration() {
		// no fading required at this point
		for dev, fix := range s.Step.Values {
			fix.ApplyTo(dev)
		}
	}

	// we need to fade
	percentUp := float64(1)
	percentDown := float64(1)

	if *s.Timings.FadeUp > 0 {
		percentUp = float64(t) / float64(*s.Timings.FadeUp)
		if percentUp > 1 {
			percentUp = 1
		}
	}

	if *s.Timings.FadeDown > 0 {
		percentDown = float64(t) / float64(*s.Timings.FadeDown)
		if percentDown > 1 {
			percentDown = 1
		}
	}

	for dev, fix := range s.Step.Values {

		var fixPrev fixture.Fixture
		if prev != nil {
			if p, ok := prev.Step.Values[dev]; ok {
				fixPrev = p
			}
		}

		fixture.Lerp(&fixPrev, &fix, percentUp, percentDown).ApplyTo(dev)

	}

}

func (s *sequencedStep) FadeDuration() int64 {
	if *s.Timings.FadeDown > *s.Timings.FadeUp {
		return int64(*s.Timings.FadeDown)
	}

	return int64(*s.Timings.FadeUp)
}
