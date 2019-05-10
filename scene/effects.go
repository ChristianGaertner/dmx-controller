package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Effect interface {
	Apply(f *fixture.Fixture)
}

type ColorEffect struct {
	Color types.Color
}

func (a *ColorEffect) Apply(f *fixture.Fixture) {
	f.SetColor(a.Color)
}

type StrobeEffect struct {
	Frequency types.Frequency
}

func (s *StrobeEffect) Apply(f *fixture.Fixture) {
	f.SetStrobe(s.Frequency)
}
