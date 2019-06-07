package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/ChristianGaertner/dmx-controller/types"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type runParamsPayload struct {
	Type run.Type      `json:"type"`
	Mode types.RunMode `json:"mode"`
}

func (wsc *WSClient) readPump() {
	defer func() {
		_ = wsc.conn.Close()
	}()

	wsc.conn.SetReadLimit(maxMessageSize)

	_ = wsc.conn.SetReadDeadline(time.Now().Add(pongWait))
	wsc.conn.SetPongHandler(func(string) error {
		return wsc.conn.SetReadDeadline(time.Now().Add(pongWait))
	})

	for {
		_, rawMessage, err := wsc.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			return
		}

		rawMessage = bytes.TrimSpace(rawMessage)

		var msg message

		err = json.Unmarshal(rawMessage, &msg)
		if err != nil {
			fmt.Println(err)
			fmt.Println("malformed json " + string(rawMessage))
			continue
		}

		switch msg.Payload.(type) {
		case runParamsPayload:
			payload := msg.Payload.(runParamsPayload)
			params := run.SceneRunParams{
				Type: payload.Type,
				Mode: payload.Mode,
			}
			wsc.engine.SetRunParams(params)
		}
	}
}
