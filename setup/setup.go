package setup

import (
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"io/ioutil"
)

type Setup struct {
	Universes map[string]serialisedUniverse `json:"universes"`
}

type serialisedUniverse struct {
	Name    string                                             `json:"name"`
	ID      dmx.UniverseId                                     `json:"id"`
	Devices map[fixture.DeviceIdentifier]serialisedDeviceSetup `json:"devices"`
}

type serialisedDeviceSetup struct {
	Name         string            `json:"name"`
	StartAddress dmx.Channel       `json:"startAddress"`
	FixtureId    string            `json:"fixtureId"`
	Mode         definition.ModeID `json:"mode"`
}

func (s *Setup) PatchDeviceMap() (*DeviceMap, error) {
	deviceMap := NewDeviceMap()
	for _, universe := range s.Universes {
		for deviceId, setup := range universe.Devices {

			def, err := definition.Load(setup.FixtureId)
			if err != nil {
				return deviceMap, fmt.Errorf("cannot load fixture for device %s: %e", deviceId, err)
			}

			fix := fixture.DefinedFixture{
				Definition: def,
				ActiveMode: setup.Mode,
			}

			dev := fixture.NewDevice(deviceId, fix)
			deviceMap.Patch(dmx.NewPatchPosition(universe.ID, setup.StartAddress), dev)
		}
	}

	return deviceMap, nil
}

func (s *Setup) GetUniverseIds() []dmx.UniverseId {
	var ids []dmx.UniverseId
	for _, u := range s.Universes {
		ids = append(ids, u.ID)
	}

	return ids
}

func Load(fileName string) (*Setup, error) {
	var s Setup

	data, err := ioutil.ReadFile(fileName)
	if err != nil {
		return nil, fmt.Errorf("cannot read setup from file: %e", err)
	}

	err = json.Unmarshal(data, &s)
	if err != nil {
		return nil, fmt.Errorf("cannot parse setup: %e", err)
	}

	return &s, nil
}
