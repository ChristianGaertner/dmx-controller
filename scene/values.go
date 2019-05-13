package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Value interface {
	Apply(f *fixture.Fixture)
}

type ColorValue struct {
	Color types.Color
}

func (a *ColorValue) Apply(f *fixture.Fixture) {
	f.SetColor(a.Color)
}

type StrobeValue struct {
	Frequency types.Frequency
}

func (s *StrobeValue) Apply(f *fixture.Fixture) {
	f.SetStrobe(s.Frequency)
}
