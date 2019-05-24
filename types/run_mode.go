package types

type RunMode int

const (
	RunModeOneShot RunMode = iota
	RunModeOneShotHold
	RunModeCycle
)
