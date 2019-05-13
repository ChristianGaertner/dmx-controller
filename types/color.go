package types

func Lerp(a, b, t float64) float64 {
	return a + (b - a)  * t
}


type Color struct {
	R, G, B float64
}

func LerpColor(a, b Color, t float64) Color {
	return Color{
		R: Lerp(a.R, b.R, t),
		G: Lerp(a.G, b.G, t),
		B: Lerp(a.B, b.B, t),
	}
}

type Frequency float64

func LerpFrequency(a, b Frequency, t float64) Frequency {
	return Frequency(Lerp(float64(a), float64(b), t))
}