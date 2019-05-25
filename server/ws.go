package server

import (
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/gorilla/websocket"
	"net/http"
	"time"
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
	Timestamp   time.Time   `json:"serverTimestamp"`
	Payload     interface{} `json:"payload"`
}

type activeSceneChangedPayload struct {
	SceneID *string `json:"sceneId"`
}

type WSClient struct {
	conn *websocket.Conn

	send chan []byte
}

func (wsc *WSClient) OnActiveChange(sceneID *string) bool {

	msg := message{
		MessageType: "ON_ACTIVE_CHANGE",
		Timestamp:   time.Now(),
		Payload: activeSceneChangedPayload{
			SceneID: sceneID,
		},
	}

	data, err := json.Marshal(msg)
	if err != nil {
		// TODO logging
		panic(err)
	}

	select {
	case wsc.send <- data:
		return true
	default:
		close(wsc.send)
		return false
	}
}

// writePump pumps messages from the hub to the websocket connection.
func (wsc *WSClient) writePump() {

	ticker := time.NewTicker(60 * time.Second)

	defer func() {
		ticker.Stop()
		_ = wsc.conn.Close()
	}()

	for {
		select {
		case message, ok := <-wsc.send:
			if !ok {
				fmt.Println("CLOSING")
				_ = wsc.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := wsc.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			_, err = w.Write(message)
			if err != nil {
				return
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			if err := wsc.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}

}

func handleWebsocket(engine *run.Engine) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		client := &WSClient{conn: conn, send: make(chan []byte, 2)}

		engine.Register(client)

		go client.writePump()
	})
}
