package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Step struct {
	Effects map[*fixture.Fixture][]Effect
	Timings Timings
}

type sequencedStep struct {
	Step  *Step
	Start types.TimeCode
	End   types.TimeCode
}

func (s *Step) Eval() {
	for fix, effects := range s.Effects {
		for _, fx := range effects {
			fx.Apply(fix)
		}
	}
}
