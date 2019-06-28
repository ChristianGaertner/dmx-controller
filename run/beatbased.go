package run

import "github.com/ChristianGaertner/dmx-controller/metronom"

func (s *SceneRun) stepBeatBased(metronom metronom.Metronom) StepInfo {

	beatsSinceActive := metronom.BeatsSince(s.stepInfo.ActiveSince)

	if beatsSinceActive > 0 {
		return StepInfo{
			Active:      s.stepInfo.Active + beatsSinceActive,
			Prev:        s.stepInfo.Active,
			ActiveSince: metronom.TimeCode(),
		}
	}

	return s.stepInfo
}
