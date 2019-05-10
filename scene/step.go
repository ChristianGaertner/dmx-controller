package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"time"
)

type Step struct {
	Effects map[*fixture.Fixture][]Effect
	FadeIn  time.Duration
	FadeOut time.Duration
}

func (s *Step) Eval() {
	for fix, effects := range s.Effects {
		for _, fx := range effects {
			fx.Apply(fix)
		}
	}
}
