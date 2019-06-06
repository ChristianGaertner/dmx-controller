package ola

import (
	"context"
	"encoding/binary"
	"fmt"
	"github.com/golang/protobuf/proto"
	"net"
)

// see http://docs.openlighting.org/ola/doc/latest/rpc_system.html
const (
	protocolVersion = 1
	versionMask     = 0xf0000000
	sizeMask        = 0x0fffffff
)

type Client struct {
	conn    net.Conn
	address string

	requestTrigger chan bool
	responses      map[uint32]chan response
	messageId      *UniqueID
}

type response struct {
	Buffer []byte
	Err error
}

func New(address string) (*Client, error) {
	conn, err := net.Dial("tcp", address)
	if err != nil {
		return nil, err
	}

	return &Client{
		conn:           conn,
		address:        address,
		messageId:      new(UniqueID),
		requestTrigger: make(chan bool, 10),
		responses:      make(map[uint32]chan response),
	}, nil
}

func (c *Client) StartReceiver(ctx context.Context) error {
	go func() {
	looper:
		for {
			select {
			case <-ctx.Done():
				break looper
			case <-c.requestTrigger:
				err := c.recv()
				if err != nil {
					panic(fmt.Errorf("failed in receiver loop: %s", err))
				}
			}
		}

		err := c.Close()
		if err != nil {
			panic(fmt.Errorf("failed closing client from receiver loop stop: %s", err))
		}
	}()

	return nil
}

func (c *Client) Close() error {
	return c.conn.Close()
}

func (c *Client) SendDmx(context context.Context, universe int, values []byte) (status bool, err error) {

	req := &DmxData{
		Data:     values,
		Universe: proto.Int(universe),
	}
	resp := &Ack{}

	req.Universe = proto.Int(universe)
	req.Data = values
	err = c.callRPCMethod(context, "UpdateDmxData", req, resp)

	if err != nil {
		return false, fmt.Errorf("failed to call SendDmx: %s", err)
	}

	return true, nil
}

func (c *Client) callRPCMethod(ctx context.Context, name string, pb proto.Message, responseMessage proto.Message) error {
	payload, err := proto.Marshal(pb)
	if err != nil {
		return fmt.Errorf("could not marshal message: %s", err)
	}

	t := Type_REQUEST;
	wrapper := &RpcMessage{
		Type:   &t,
		Id:     proto.Uint32(c.messageId.Get()),
		Name:   proto.String(name),
		Buffer: payload,
	}

	encodedMsg, err := proto.Marshal(wrapper)
	if err != nil {
		return fmt.Errorf("could not marshal wrapper message: %s", err)
	}

	header := ((protocolVersion << 28) & versionMask) | len(encodedMsg)&sizeMask

	bs := make([]byte, 4)
	binary.LittleEndian.PutUint32(bs, uint32(header))

	_, err = c.conn.Write(bs)
	if err != nil {
		return fmt.Errorf("could not send header to server: %s", err)
	}
	_, err = c.conn.Write(encodedMsg)
	if err != nil {
		return fmt.Errorf("could not send data to server: %s", err)
	}

	data := make(chan response, 1)

	c.responses[*wrapper.Id] = data

	c.requestTrigger <- true


	var res response
	select {
	case res = <-data:
	case <-ctx.Done():
		return ctx.Err()
	}

	if res.Err != nil {
		return res.Err
	}

	resWrapper := new(RpcMessage)

	if len(res.Buffer) == 0 {
		// TODO check what should happen here...
		return nil
	}

	if err := proto.Unmarshal(res.Buffer, resWrapper); err != nil {
		return fmt.Errorf("could not decode response wrapper message: %s", err)
	}

	resBuffer := resWrapper.GetBuffer()
	if err := proto.Unmarshal(resBuffer, responseMessage); err != nil {
		return fmt.Errorf("could not decode data in message: %s", err)
	}
	return nil
}

func (c *Client) recv() error {
	header := make([]byte, 4)

	_, err := c.conn.Read(header)
	if err != nil {
		return fmt.Errorf("cannot read header: %s", err)
	}

	headerValue := int(binary.LittleEndian.Uint32(header))

	size := headerValue & sizeMask

	data := make([]byte, size)

	_, err = c.conn.Read(data)
	if err != nil {
		return fmt.Errorf("cannot read data: %s", err)
	}

	wrapper := &RpcMessage{}

	if err := proto.Unmarshal(data, wrapper); err != nil {
		return fmt.Errorf("cannot unmarshal wrapper message: %s", err)
	}

	var resError error

	if *wrapper.Type == Type_RESPONSE_FAILED {
		resError = fmt.Errorf("response failed: %s", wrapper.Buffer)
	}

	res := response{
		Buffer: wrapper.Buffer,
		Err: resError,
	}

	if consumer, ok := c.responses[*wrapper.Id]; ok {
		select {
		case consumer <- res:
			return nil
		default:
			return fmt.Errorf("no consumer for message %d found", *wrapper.Id)
		}
	}

	return fmt.Errorf("no consumer for message %d found", *wrapper.Id)
}
