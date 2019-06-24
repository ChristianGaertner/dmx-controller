package scene

import (
	"encoding/json"
	"fmt"
)

type encodedScene struct {
	ID             string  `json:"id"`
	Meta           Meta    `json:"meta"`
	Steps          []*Step `json:"steps"`
	DefaultTimings Timings `json:"defaultTimings"`
}

func (s *Scene) MarshalJSON() ([]byte, error) {

	var steps []*Step

	for _, s := range s.sequence {
		steps = append(steps, s.Step)
	}

	x := encodedScene{
		ID:             s.ID,
		Meta:           s.Meta,
		Steps:          steps,
		DefaultTimings: s.defaultTimings,
	}
	return json.Marshal(x)
}

func (s *Scene) UnmarshalJSON(data []byte) error {
	x := encodedScene{}

	err := json.Unmarshal(data, &x)
	if err != nil {
		return err
	}

	if x.ID != x.Meta.ID {
		return fmt.Errorf("IDs on encoded scene do not match, '%s' != '%s'", x.ID, x.Meta.ID)
	}

	*s = *New(x.Meta, x.Steps, *x.DefaultTimings.Duration, *x.DefaultTimings.FadeUp, *x.DefaultTimings.FadeDown)
	return nil
}

func (s *Step) UnmarshalJSON(data []byte) error {
	var objMap map[string]*json.RawMessage

	err := json.Unmarshal(data, &objMap)
	if err != nil {
		return err
	}

	var id string
	err = json.Unmarshal(*objMap["id"], &id)
	if err != nil {
		return err
	}

	var values StepOutput

	err = json.Unmarshal(*objMap["values"], &values)
	if err != nil {
		return err
	}

	var timings Timings
	if v, ok := objMap["timings"]; ok && v != nil {
		err = json.Unmarshal(*v, &timings)
		if err != nil {
			return err
		}
	}

	var rawEffects []*json.RawMessage
	var effects []Effect
	if v, ok := objMap["effects"]; ok && v != nil {
		err = json.Unmarshal(*v, &rawEffects)
		if err != nil {
			return err
		}

		var m map[string]interface{}
		for _, rawMessage := range rawEffects {
			err = json.Unmarshal(*rawMessage, &m)
			if err != nil {
				return err
			}

			var typ EffectType
			err = typ.UnmarshalText([]byte(m["type"].(string)))
			if err != nil {
				return err
			}
			if typ == DimmerSineType {
				fx := DimmerSine{}
				err = json.Unmarshal(*rawMessage, &fx)
				effects = append(effects, &fx)
			}

			if err != nil {
				return err
			}

		}
	}

	s.ID = id
	s.Timings = timings
	s.Values = values
	s.Effects = effects

	return nil
}
