package server

import (
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/ChristianGaertner/dmx-controller/system"
	"github.com/gorilla/websocket"
	"net/http"
	"time"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 20 * time.Second
	maxMessageSize = 1 << 13
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
	MessageType string       `json:"type"`
	Timestamp   time.Time    `json:"timestamp"`
	Payload     interface{}  `json:"payload"`
	Stats       system.Stats `json:"stats"`
}

const (
	MsgTypeOnProgressChange = "ON_PROGRESS_CHANGE"
	MsgTypeInitFixtures     = "INIT_FIXTURES"
	MsgTypeSendRunParams    = "SEND_RUN_PARAMS"
	MsgTypePreviewStep      = "PREVIEW_STEP"
)

type WSClient struct {
	conn *websocket.Conn

	send   chan interface{}
	engine *run.Engine
}

func (h *handlers) handleWebsocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	client := &WSClient{
		conn:   conn,
		send:   make(chan interface{}, 2),
		engine: h.engine,
	}

	h.engine.Register(client)

	go client.writePump()
	go client.readPump()

	// init
	client.InitFixtures(h.engine.Setup, h.engine.DeviceMap)
}
