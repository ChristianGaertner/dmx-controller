package fixture

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/dmx"
)

type DeviceIdentifier string

type Device struct {
	Uuid    DeviceIdentifier
	values  []dmx.Value
	Fixture Fixture
}

func NewDevice(uuid string, fixture Fixture) *Device {
	return &Device{
		Uuid:    DeviceIdentifier(uuid),
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

type DevicePool struct {
	devices map[DeviceIdentifier]*Device
}

func PoolFromDeviceMap(dm *DeviceMap) *DevicePool {
	devices := make(map[DeviceIdentifier]*Device)

	for _, dev := range dm.devices {
		devices[dev.Uuid] = dev
	}

	return &DevicePool{
		devices: devices,
	}
}

func (p *DevicePool) Get(dev DeviceIdentifier) *Device {
	return p.devices[dev]
}

func (p *DevicePool) GetIdentifiers() []DeviceIdentifier {
	var ids []DeviceIdentifier
	for id := range p.devices {
		ids = append(ids, id)
	}

	return ids
}

type DeviceMap struct {
	devices map[int]*Device
}

func NewDeviceMap() *DeviceMap {
	return &DeviceMap{
		devices: make(map[int]*Device),
	}
}

func (dM *DeviceMap) Place(channel dmx.Channel, d *Device) {
	dM.devices[channel.ToSliceIndex()] = d
}

func (dM *DeviceMap) Reset() {
	for _, device := range dM.devices {
		device.Reset()
	}
}

func (dM *DeviceMap) Render(buffer *dmx.Buffer) {
	for i, device := range dM.devices {
		values := device.GetValues()
		buffer.Apply(dmx.NewChannelFromIndex(i), values)
		device.Reset()
	}
}

func (dM *DeviceMap) RenderLoop(ctx context.Context, onRender <-chan bool, buffer *dmx.Buffer) {
	for {
		select {
		case <-onRender:
			dM.Render(buffer)
		case <-ctx.Done():
			return
		}
	}
}

func (d *Device) MarshalText() ([]byte, error) {
	return []byte(d.Uuid), nil
}
