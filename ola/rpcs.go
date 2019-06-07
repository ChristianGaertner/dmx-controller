package ola

import (
	"context"
	"fmt"
	"github.com/golang/protobuf/proto"
)

func (c *Client) SendDmx(ctx context.Context, universe int, values []byte) (bool, error) {

	req := &DmxData{
		Data:     values,
		Universe: proto.Int(universe),
	}
	resp := &Ack{}

	req.Universe = proto.Int(universe)
	req.Data = values
	err := c.callRPCMethod(ctx, "UpdateDmxData", req, resp)

	if err != nil {
		return false, fmt.Errorf("failed to call SendDmx: %s", err)
	}

	return true, nil
}

func (c *Client) GetUniverseList(ctx context.Context) ([]*UniverseInfo, error) {
	req := &OptionalUniverseRequest{}
	resp := &UniverseInfoReply{}

	err := c.callRPCMethod(ctx, "GetUniverseInfo", req, resp)

	if err != nil {
		return nil, err
	}

	return resp.Universe, nil
}