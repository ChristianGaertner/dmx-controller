package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
)

type Step struct {
	Effects map[*fixture.Fixture][]Effect
	Timings Timings
}

func (s *Step) Eval() {
	for fix, effects := range s.Effects {
		for _, fx := range effects {
			fx.Apply(fix)
		}
	}
}
