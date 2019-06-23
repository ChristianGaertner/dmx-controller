package server

import (
	"encoding/json"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/setup"
	"github.com/gorilla/websocket"
	"time"
)

type activeSceneChangedPayload struct {
	SceneID  *string `json:"sceneId"`
	Progress float64 `json:"progress"`
}

func (wsc *WSClient) OnActiveChange(sceneID *string, progress float64) bool {
	msg := message{
		MessageType: MsgTypeOnActiveChange,
		Timestamp:   time.Now(),
		Payload: activeSceneChangedPayload{
			SceneID:  sceneID,
			Progress: progress,
		},
	}

	select {
	case wsc.send <- msg:
		return true
	default:
		close(wsc.send)
		return false
	}
}

type initFixturesPayload struct {
	Setup    *setup.Setup                                         `json:"setup"`
	Fixtures map[fixture.DeviceIdentifier]*fixture.DefinedFixture `json:"fixtures"`
}

func (wsc *WSClient) InitFixtures(setup *setup.Setup, deviceMap *setup.DeviceMap) bool {

	fixs := make(map[fixture.DeviceIdentifier]*fixture.DefinedFixture)

	for _, dev := range deviceMap.GetIdentifiers() {
		fixs[dev] = deviceMap.Get(dev).Fixture.GetDefinition()
	}

	msg := message{
		MessageType: MsgTypeInitFixtures,
		Timestamp:   time.Now(),
		Payload: initFixturesPayload{
			Setup:    setup,
			Fixtures: fixs,
		},
	}

	select {
	case wsc.send <- msg:
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

			data, err := json.Marshal(message)
			if err != nil {
				return
			}

			_, err = w.Write(data)
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
