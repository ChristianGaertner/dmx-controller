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

func (f *Fixture) GetColor() types.Color {
	return types.Color{
		R: float64(f.Device.Get(dmx.NewChannel(1)))/255,
		G: float64(f.Device.Get(dmx.NewChannel(2)))/255,
		B: float64(f.Device.Get(dmx.NewChannel(3)))/255,
	}
}

func (f *Fixture) SetStrobe(freq types.Frequency) {
	f.Device.Set(dmx.NewChannel(4), byte(freq*255))
}

func (f *Fixture) GetStrobe() types.Frequency {
	return types.Frequency(float64(f.Device.Get(dmx.NewChannel(4))) / 255)
}

func (f *Fixture) Lerp(next *Fixture, t float64) {
	f.SetColor(types.LerpColor(f.GetColor(), next.GetColor(), t))
	f.SetStrobe(types.LerpFrequency(f.GetStrobe(), next.GetStrobe(), t))
}