package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type runParamsPayload struct {
	ID     string             `json:"id"`
	Params run.SceneRunParams `json:"params"`
}

type previewStepPayload struct {
	Step *scene.Step `json:"step"`
}

type stopStepPreviewPayload struct {
	StepId string `json:"stepId"`
}

type sendBPMPayload struct {
	BPM types.BPM `json:"bpm"`
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
			wsc.engine.SetRunParams(payload.ID, payload.Params)
		case previewStepPayload:
			payload := msg.Payload.(previewStepPayload)
			wsc.engine.PreviewStep(payload.Step)
		case stopStepPreviewPayload:
			payload := msg.Payload.(stopStepPreviewPayload)
			wsc.engine.StopStepPreview(payload.StepId)
		case sendBPMPayload:
			payload := msg.Payload.(sendBPMPayload)
			wsc.engine.SetBPM(payload.BPM)

		}
	}
}
