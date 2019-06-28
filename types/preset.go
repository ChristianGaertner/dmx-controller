package types

type PresetID string

func LerpPreset(a, b *PresetID, percentUp, percentDown float64) *PresetID {
	if percentUp < 0.5 {
		return a
	}

	return b
}

func MaxPresetID(a, b *PresetID) *PresetID {
	if a == nil {
		return b
	}
	if b == nil {
		return a
	}

	if *a > *b {
		return a
	}

	return b
}
