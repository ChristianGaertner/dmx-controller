package dmx

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/ola"
	"time"
)

type olaRPCRenderer struct {
	client *ola.Client
}

func NewOlaRPCRenderer(address string) (BufferRenderer, error) {
	client, err := ola.New(address)
	if err != nil {
		return nil, err
	}
	return &olaRPCRenderer{
		client: client,
	}, nil
}

func (o *olaRPCRenderer) Boot(ctx context.Context) error {
	return o.client.StartReceiver(ctx)
}

func (o *olaRPCRenderer) Render(ctx context.Context, buffer *Buffer) error {
	ok, err := o.client.SendDmx(ctx, 0, buffer.channels)
	if err != nil {
		return err
	}

	if !ok {
		return fmt.Errorf("sendDmx status not ok")
	}
	return nil
}

func (o *olaRPCRenderer) GetTicker(ctx context.Context) *time.Ticker {
	return time.NewTicker(25 * time.Millisecond)
}
