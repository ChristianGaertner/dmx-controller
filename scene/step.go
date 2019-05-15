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

func (s *Step) Eval() {
	for dev, fix := range s.Values {
		fix.ApplyTo(dev)
	}
}
