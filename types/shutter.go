package types

import "fmt"

type ShutterState uint32

const (
	ShutterOpen ShutterState = iota
	ShutterStrobe
	ShutterClosed
)

type Shutter struct {
	State           ShutterState `json:"state"`
	StrobeFrequency Frequency    `json:"strobeFrequency"`
}

func LerpShutter(a, b *Shutter, percentUp, percentDown float64) *Shutter {
	va := Shutter{}
	if a != nil {
		va = *a
	}

	vb := Shutter{}
	if b != nil {
		vb = *b
	}

	var percent float64
	if va.State == ShutterClosed {
		percent = percentUp
	} else {
		percent = percentDown
	}

	var state ShutterState
	if percent < 0.5 {
		state = va.State
	} else {
		state = vb.State
	}

	return &Shutter{
		State:           state,
		StrobeFrequency: *LerpFrequency(&va.StrobeFrequency, &vb.StrobeFrequency, percentUp, percentDown),
	}
}

func MaxShutter(a, b *Shutter) *Shutter {
	if a == nil {
		return b
	}
	if b == nil {
		return a
	}

	// lower means 'more open'
	if a.State < b.State {
		return a
	}

	if a.State != ShutterStrobe && b.State != ShutterStrobe {
		// States are equal and not shutter, return a or b... does not matter..
		return b
	}

	if a.StrobeFrequency > b.StrobeFrequency {
		return a
	}

	return b
}

type Frequency float64

func LerpFrequency(a, b *Frequency, percentUp, percentDown float64) *Frequency {
	va := Frequency(0)
	if a != nil {
		va = *a
	}

	vb := Frequency(0)
	if b != nil {
		vb = *b
	}

	f := Frequency(Lerp(float64(va), float64(vb), percentUp, percentDown))
	return &f
}

func (t ShutterState) MarshalText() ([]byte, error) {
	var s string
	switch t {
	case ShutterOpen:
		s = "ShutterOpen"
	case ShutterClosed:
		s = "ShutterClosed"
	case ShutterStrobe:
		s = "ShutterStrobe"
	}

	return []byte(s), nil
}

func (t *ShutterState) UnmarshalText(data []byte) error {
	s := string(data)
	switch s {
	case "ShutterOpen":
		*t = ShutterOpen
	case "ShutterClosed":
		*t = ShutterClosed
	case "ShutterStrobe":
		*t = ShutterStrobe
	default:
		return fmt.Errorf("ShutterState '%s' does not exist", s)
	}

	return nil
}
