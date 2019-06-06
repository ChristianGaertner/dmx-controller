package dmx

import (
	"context"
	"github.com/tarm/serial"
	"io"
	"time"
)

// Adapted from spec sheet https://dol2kh495zr52.cloudfront.net/pdf/misc/dmx_usb_pro_api_spec.pdf
const (
	dmxStartCode = 0x7E
	dmxEndCode   = 0xE7

	sendDmxRdmTx = 7

	dmxHeaderLength = 4
	frameSize       = 512
)

type enttecRenderer struct {
	serial io.WriteCloser
	header []byte
	footer []byte
}

func NewEnttecRenderer() (BufferRenderer, error) {

	conf := &serial.Config{
		Name: "/dev/tty.usbserial-AL05J4WZ",
		Baud: 57600,
	}

	s, err := serial.OpenPort(conf)
	if err != nil {
		return nil, err
	}

	return &enttecRenderer{
		serial: s,
		header: []byte{
			dmxStartCode,
			sendDmxRdmTx,
			frameSize & 0xFF,
			frameSize >> 8,
		},
		footer: []byte{
			dmxEndCode,
		},
	}, nil
}

func (e *enttecRenderer) Render(ctx context.Context, buffer *Buffer) (err error) {
	_, err = e.serial.Write(e.header)
	if err != nil {
		return
	}
	_, err = e.serial.Write(buffer.channels)
	if err != nil {
		return
	}
	_, err = e.serial.Write(e.footer)
	return
}

func (e *enttecRenderer) Boot(ctx context.Context) error {
	return nil
}

func (e *enttecRenderer) GetTicker(ctx context.Context) *time.Ticker {
	return time.NewTicker(25 * time.Millisecond)
}
