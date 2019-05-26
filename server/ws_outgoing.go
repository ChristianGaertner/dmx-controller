package server

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"time"
)

type activeSceneChangedPayload struct {
	SceneID *string `json:"sceneId"`
}

func (wsc *WSClient) OnActiveChange(sceneID *string) bool {
	msg := message{
		MessageType: MsgTypeOnActiveChange,
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

	ticker := time.NewTicker(2 * time.Second)

	defer func() {
		wsc.engine.Unregister(wsc)
		ticker.Stop()
		_ = wsc.conn.Close()
	}()

	for {
		select {
		case message, ok := <-wsc.send:
			_ = wsc.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
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
			_ = wsc.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := wsc.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}