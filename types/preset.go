package types

type PresetID string

func LerpPreset(a, b *PresetID, percentUp, percentDown float64) *PresetID {
	if percentUp < 0.5 {
		return a
	}

	return b
}
