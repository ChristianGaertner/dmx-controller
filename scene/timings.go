package scene

import "time"

type Timings struct {
	Duration *time.Duration `json:"duration"`
	FadeUp   *time.Duration `json:"fadeUp"`
	FadeDown *time.Duration `json:"fadeDown"`
}
