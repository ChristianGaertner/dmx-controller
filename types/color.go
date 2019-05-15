package types

func Lerp(a, b, percentUp, percentDown float64) float64 {
	if a < b {
		return a + (b-a)*percentUp
	}

	return a + (b-a)*percentDown
}

type Color struct {
	R, G, B float64
}

func LerpColor(a, b Color, percentUp, percentDown float64) Color {
	return Color{
		R: Lerp(a.R, b.R, percentUp, percentDown),
		G: Lerp(a.G, b.G, percentUp, percentDown),
		B: Lerp(a.B, b.B, percentUp, percentDown),
	}
}

type Frequency float64

func LerpFrequency(a, b Frequency, percentUp, percentDown float64) Frequency {
	return Frequency(Lerp(float64(a), float64(b), percentUp, percentDown))
}
