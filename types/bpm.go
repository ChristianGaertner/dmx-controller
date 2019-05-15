package types

import "time"

type BPM float64

func (b BPM) AsDuration() time.Duration {
	return time.Duration(float64(time.Minute.Nanoseconds()) / float64(b))
}
