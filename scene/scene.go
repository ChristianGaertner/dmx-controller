package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"math"
)

type FixtureCue []Step

type Scene struct {
	Cues map[*fixture.Fixture]FixtureCue
}

func New(cues map[*fixture.Fixture]FixtureCue) *Scene {
	return &Scene{
		Cues: cues,
	}
}

func (s *Scene) ComputeNumSteps() int {
	max := float64(0)
	for _, cue := range s.Cues {
		max = math.Max(max, float64(len(cue)))
	}

	return int(max)
}

func (s *Scene) Eval(step int) {
	for fix, cue := range s.Cues {
		if len(cue) > step {
			if s := cue[step]; s != nil {
				for _, effect := range s {
					effect.Apply(fix)
				}
			}
		}
	}
}
