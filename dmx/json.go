package dmx

import "encoding/json"

type jsonPatchPosition struct {
	UniverseId UniverseId `json:"universeId"`
	Address    Channel    `json:"address"`
}

func (p PatchPosition) MarshalJSON() ([]byte, error) {
	serialized := jsonPatchPosition{
		UniverseId: p.GetUniverseId(),
		Address:    p.GetAddress(),
	}

	return json.Marshal(serialized)
}

func (p *PatchPosition) UnmarshalJSON(data []byte) error {
	serialized := jsonPatchPosition{}

	err := json.Unmarshal(data, &serialized)
	if err != nil {
		return err
	}

	*p = NewPatchPosition(serialized.UniverseId, serialized.Address)
	return nil
}
