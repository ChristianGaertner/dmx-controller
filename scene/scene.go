package scene

type Scene struct {
	Sequence []*Step
}

func New(sequence []*Step) *Scene {
	return &Scene{
		Sequence: sequence,
	}
}

func (s *Scene) Eval(step int) {
	s.Sequence[step].Eval()
}
