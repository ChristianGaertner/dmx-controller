package setup

import (
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/fixture/definition"
	"io/ioutil"
)

type serialisedSetup struct {
	Universes map[string]serialisedUniverse `json:"universes"`
}

type serialisedUniverse struct {
	Name    string                                             `json:"name"`
	Devices map[fixture.DeviceIdentifier]serialisedDeviceSetup `json:"devices"`
}

type serialisedDeviceSetup struct {
	Name         string            `json:"name"`
	StartAddress dmx.Channel       `json:"startAddress"`
	FixtureId    string            `json:"fixtureId"`
	Mode         definition.ModeID `json:"mode"`
}

func (s *serialisedSetup) PatchDeviceMap(deviceMap *fixture.DeviceMap) error {
	if len(s.Universes) > 1 {
		panic("too many universes")
	}
	for _, universe := range s.Universes {
		for deviceId, setup := range universe.Devices {

			def, err := definition.Load(setup.FixtureId)
			if err != nil {
				return fmt.Errorf("cannot load fixture for device %s: %e", deviceId, err)
			}

			fix := fixture.DefinedFixture{
				Definition: def,
				ActiveMode: setup.Mode,
			}

			dev := fixture.NewDevice(deviceId, fix)
			deviceMap.Patch(setup.StartAddress, dev)
		}
	}

	return nil
}

func Load(fileName string) (*serialisedSetup, error) {
	var s serialisedSetup

	data, err := ioutil.ReadFile(fileName)
	if err != nil {
		return nil, fmt.Errorf("cannot read setup from file: %e", err)
	}

	err = json.Unmarshal(data, &s)
	if err != nil {
		return nil, fmt.Errorf("cannot parse setup: %e", err)
	}

	if len(s.Universes) > 1 {
		return nil, fmt.Errorf("cannot load more than one (1x 512) dmx universe")
	}

	return &s, nil
}
