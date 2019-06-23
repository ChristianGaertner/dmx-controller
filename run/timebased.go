package run

import (
	"github.com/ChristianGaertner/dmx-controller/metronom"
	"time"
)

func (s *SceneRun) stepTimeBased(metronom metronom.Metronom) StepInfo {
	tc := metronom.TimeCode()

	step := s.scene.GetStepAtIndex(s.stepInfo.Active)

	if *step.Timings.Duration < time.Duration(tc-s.stepInfo.ActiveSince) {
		return StepInfo{
			Active:      s.stepInfo.Active + 1,
			Prev:        s.stepInfo.Active,
			ActiveSince: tc,
		}
	}

	return s.stepInfo
}
