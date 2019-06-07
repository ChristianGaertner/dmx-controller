package dmx

import (
	"context"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/ola"
	"log"
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
	log.Println("connected to OLA server at", address)
	return &olaRPCRenderer{
		client: client,
	}, nil
}

func (o *olaRPCRenderer) Boot(ctx context.Context) error {
	err := o.client.StartReceiver(ctx)
	if err != nil {
		return err
	}

	universes, err := o.client.GetUniverseList(ctx)
	if err != nil {
		return err
	}

	if len(universes) == 0 {
		return fmt.Errorf("no universe configured with OLA")
	}
	return nil
}

func (o *olaRPCRenderer) Render(ctx context.Context, buffer *Buffer) error {
	for universe, channels := range buffer.universes {
		ok, err := o.client.SendDmx(ctx, int(universe), channels)
		if err != nil {
			return err
		}

		if !ok {
			return fmt.Errorf("sendDmx status not ok")
		}
	}
	return nil
}

func (o *olaRPCRenderer) GetTicker(ctx context.Context) *time.Ticker {
	return time.NewTicker(25 * time.Millisecond)
}
