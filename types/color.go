package types

import "math"

func Lerp(a, b, percentUp, percentDown float64) float64 {
	if a < b {
		return a + (b-a)*percentUp
	}

	return a + (b-a)*percentDown
}

type Color struct {
	R, G, B float64
}

func LerpColor(a, b *Color, percentUp, percentDown float64) *Color {
	var va Color
	if a != nil {
		va = *a
	}

	var vb Color
	if b != nil {
		vb = *b
	}

	return &Color{
		R: Lerp(va.R, vb.R, percentUp, percentDown),
		G: Lerp(va.G, vb.G, percentUp, percentDown),
		B: Lerp(va.B, vb.B, percentUp, percentDown),
	}
}

func ColorDistance(p, q *Color) float64 {
	return math.Sqrt(math.Pow(p.R-q.R, 2) + math.Pow(p.G-q.G, 2) + math.Pow(p.B-q.B, 2))
}

// DimmerValue is in the range of 0 [off] to 1 [full]
type DimmerValue float64

func NewDimmerValue(v float64) *DimmerValue {
	return (*DimmerValue)(&v)
}

func LerpDimmerValue(a, b *DimmerValue, percentUp, percentDown float64) *DimmerValue {
	va := DimmerValue(0)
	if a != nil {
		va = *a
	}

	vb := DimmerValue(0)
	if b != nil {
		vb = *b
	}

	f := DimmerValue(Lerp(float64(va), float64(vb), percentUp, percentDown))
	return &f
}
