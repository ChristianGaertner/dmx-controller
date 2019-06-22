package setup

import (
	"context"
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/fixture"
)

type DeviceMap struct {
	devices map[fixture.DeviceIdentifier]*fixture.Device
	patch   map[fixture.DeviceIdentifier]dmx.PatchPosition
}

func NewDeviceMap() *DeviceMap {
	return &DeviceMap{
		devices: make(map[fixture.DeviceIdentifier]*fixture.Device),
		patch:   make(map[fixture.DeviceIdentifier]dmx.PatchPosition),
	}
}

func (dM *DeviceMap) GetIdentifiers() []fixture.DeviceIdentifier {
	var ids []fixture.DeviceIdentifier
	for id := range dM.devices {
		ids = append(ids, id)
	}

	return ids
}


func (dM *DeviceMap) Get(id fixture.DeviceIdentifier) *fixture.Device {
	return dM.devices[id]
}

func (dM *DeviceMap) GetPatchPosition(id fixture.DeviceIdentifier) dmx.PatchPosition {
	return dM.patch[id]
}

func (dM *DeviceMap) Patch(p dmx.PatchPosition, d *fixture.Device) {
	dM.patch[d.Uuid] = p
	dM.devices[d.Uuid] = d
}

func (dM *DeviceMap) Reset() {
	for _, device := range dM.devices {
		device.Reset()
	}
}

func (dM *DeviceMap) Render(buffer *dmx.Buffer) {
	for deviceId, p := range dM.patch {
		device := dM.Get(deviceId)
		values := device.GetValues()
		buffer.Apply(p, values)
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
