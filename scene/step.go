package scene

import (
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/types"
	"time"
)

type Step struct {
	ID      string     `json:"id"`
	Values  StepOutput `json:"values,omitempty"`
	Effects []Effect   `json:"effects,omitempty"`
	Timings Timings    `json:"timings,omitempty"`
}

type sequencedStep struct {
	Step    *Step
	Start   types.TimeCode
	End     types.TimeCode
	Timings Timings
}

func (s *sequencedStep) Eval(tc types.TimeCode, activeFor time.Duration, prev *sequencedStep) StepOutput {
	percentUp := calcPercent(activeFor, *s.Timings.FadeUp)
	percentDown := calcPercent(activeFor, *s.Timings.FadeDown)

	output := s.Step.getStepOutput(tc)

	var prevOutput StepOutput
	if prev != nil {
		prevOutput = prev.Step.getStepOutput(tc)
	}

	outputWithEffects := make(StepOutput)

	var deviceIds []fixture.DeviceIdentifier
	if prevOutput != nil {
		for devId := range prevOutput {
			deviceIds = append(deviceIds, devId)
		}
	}
	for devId := range output {
		deviceIds = append(deviceIds, devId)
	}

	for _, devId := range deviceIds {
		var fixPrev *fixture.Value
		if prevOutput != nil {
			if p, ok := prevOutput[devId]; ok {
				fixPrev = p
			}
		}

		var fix *fixture.Value
		if p, ok := output[devId]; ok {
			fix = p
		}

		finalValue := fixture.Lerp(fixPrev, fix, percentUp, percentDown)
		outputWithEffects[devId] = finalValue
	}

	return outputWithEffects
}

func (s *Step) getStepOutput(tc types.TimeCode) StepOutput {
	out := []StepOutput{s.Values}

	for _, fx := range s.Effects {
		out = append(out, fx.Generate(tc))
	}

	return HTPMergeStepOutput(out...)
}

func calcPercent(tc time.Duration, d time.Duration) float64 {
	p := float64(1)

	if d > 0 {
		p = float64(tc) / float64(d)
	}

	if p > 1 {
		p = 1
	}

	return p
}

func (s *sequencedStep) FadeDuration() int64 {
	if *s.Timings.FadeDown > *s.Timings.FadeUp {
		return int64(*s.Timings.FadeDown)
	}

	return int64(*s.Timings.FadeUp)
}
