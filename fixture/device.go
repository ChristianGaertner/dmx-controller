package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/dmx"
)

type DeviceIdentifier string

type Device struct {
	Uuid    DeviceIdentifier
	values  []dmx.Value
	Fixture Fixture
}

func NewDevice(uuid DeviceIdentifier, fixture Fixture) *Device {
	return &Device{
		Uuid:    uuid,
		values:  make([]dmx.Value, fixture.NumChannels()),
		Fixture: fixture,
	}
}

func (d *Device) GetValues() []dmx.Value {
	return d.values
}

func (d *Device) Reset() {
	for i := range d.values {
		d.values[i] = 0
	}
}

func (d *Device) Set(channel dmx.Channel, value dmx.Value) {
	d.values[channel.ToSliceIndex()] = value
}

func (d *Device) Get(channel dmx.Channel) dmx.Value {
	return d.values[channel.ToSliceIndex()]
}

func (d *Device) MarshalText() ([]byte, error) {
	return []byte(d.Uuid), nil
}
