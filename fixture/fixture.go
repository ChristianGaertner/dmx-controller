package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Fixture struct {
	Device *Device
}

func (f *Fixture) SetColor(color types.Color) {
	f.Device.Set(dmx.NewChannel(1), byte(color.R*255))
	f.Device.Set(dmx.NewChannel(2), byte(color.G*255))
	f.Device.Set(dmx.NewChannel(3), byte(color.B*255))
}

func (f *Fixture) SetStrobe(freq types.Frequency) {
	f.Device.Set(dmx.NewChannel(4), byte(freq*255))
}
