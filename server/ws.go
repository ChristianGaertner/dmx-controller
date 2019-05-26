package server

import (
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/gorilla/websocket"
	"net/http"
	"time"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 20 * time.Second
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// TODO proper checks
		return true
	},
}

type message struct {
	MessageType string      `json:"type"`
	Timestamp   time.Time   `json:"timestamp"`
	Payload     interface{} `json:"payload"`
}

const (
	MsgTypeOnActiveChange = "ON_ACTIVE_CHANGE"
	MsgTypeSendRunParams  = "SEND_RUN_PARAMS"
)

type WSClient struct {
	conn *websocket.Conn

	send   chan []byte
	engine *run.Engine
}

func handleWebsocket(engine *run.Engine) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		client := &WSClient{
			conn:   conn,
			send:   make(chan []byte, 2),
			engine: engine,
		}

		engine.Register(client)

		go client.writePump()
		go client.readPump()
	})
}
