package fixture

import (
	"github.com/ChristianGaertner/dmx-controller/dmx"
	"github.com/ChristianGaertner/dmx-controller/types"
)

type Fixture interface {
	SetColor(color types.Color)
	GetColor() types.Color
	SetStrobe(frequency types.Frequency)
	GetStrobe() types.Frequency
}

type SimpleFixture struct {
	Device *Device
}

func (f *SimpleFixture) SetColor(color types.Color) {
	f.Device.Set(dmx.NewChannel(1), byte(color.R*255))
	f.Device.Set(dmx.NewChannel(2), byte(color.G*255))
	f.Device.Set(dmx.NewChannel(3), byte(color.B*255))
}

func (f *SimpleFixture) GetColor() types.Color {
	return types.Color{
		R: float64(f.Device.Get(dmx.NewChannel(1)))/255,
		G: float64(f.Device.Get(dmx.NewChannel(2)))/255,
		B: float64(f.Device.Get(dmx.NewChannel(3)))/255,
	}
}

func (f *SimpleFixture) SetStrobe(freq types.Frequency) {
	f.Device.Set(dmx.NewChannel(4), byte(freq*255))
}

func (f *SimpleFixture) GetStrobe() types.Frequency {
	return types.Frequency(float64(f.Device.Get(dmx.NewChannel(4))) / 255)
}

func (f *SimpleFixture) MutatingLerpFixture(from, to *SimpleFixture, t float64) {
	to.SetColor(types.LerpColor(from.GetColor(), to.GetColor(), t))
	to.SetStrobe(types.LerpFrequency(from.GetStrobe(), to.GetStrobe(), t))
}