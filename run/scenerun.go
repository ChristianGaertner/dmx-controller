package run

import (
	"github.com/ChristianGaertner/dmx-controller/metronom"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Type int

const (
	UseStepTimings Type = iota
)

type StepInfo struct {
	Prev        int
	Active      int
	ActiveSince types.TimeCode
}

type SceneRun struct {
	scene  *scene.Scene
	params SceneRunParams

	activeSince types.TimeCode
	stepInfo    StepInfo
}

type SceneRunParams struct {
	Type Type
	Mode types.RunMode
}

func (s *SceneRun) eval(tc types.TimeCode) scene.StepOutput {
	return s.scene.Eval(tc-s.activeSince, time.Duration(tc-s.stepInfo.ActiveSince), s.stepInfo.Active, s.stepInfo.Prev)
}

func (s *SceneRun) Step(metronom metronom.Metronom) bool {
	if s == nil {
		return true
	}
	switch s.params.Type {
	case UseStepTimings:
		s.stepInfo = s.stepTimeBased(metronom)
	default:
		panic("run.Type not implemented")
	}

	return s.applyRunMode()
}

func (s *SceneRun) applyRunMode() bool {
	switch s.params.Mode {
	case types.RunModeCycle:
		if s.stepInfo.Active >= s.scene.NumSteps() {
			s.stepInfo.Active = 0
		}
		return false
	case types.RunModeOneShotHold:
		if s.stepInfo.Active >= s.scene.NumSteps() {
			s.stepInfo.Active = s.scene.NumSteps() - 1
		}
		return false
	case types.RunModeOneShot:
		if s.stepInfo.Active >= s.scene.NumSteps() {
			return true
		}
		return false
	}

	return false
}
