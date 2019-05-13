package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Step struct {
	Values  map[*fixture.Fixture][]Value
	Timings Timings
}

type sequencedStep struct {
	Step  *Step
	Start types.TimeCode
	End   types.TimeCode
}

func (s *Step) Eval() {
	for fix, values := range s.Values {
		for _, fx := range values {
			fx.Apply(fix)
		}
	}
}
