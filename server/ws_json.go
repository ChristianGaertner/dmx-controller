package server

import (
	"encoding/json"
	"fmt"
	"time"
)

type jsonMessage struct {
	MessageType string      `json:"type"`
	Timestamp   time.Time   `json:"timestamp"`
	Payload     interface{} `json:"payload"`
}

func (m *message) UnmarshalJSON(data []byte) error {
	x := jsonMessage{}

	err := json.Unmarshal(data, &x)
	if err != nil {
		return err
	}

	m.MessageType = x.MessageType
	m.Timestamp = x.Timestamp

	var objMap map[string]*json.RawMessage
	err = json.Unmarshal(data, &objMap)
	if err != nil {
		return err
	}

	switch x.MessageType {
	case MsgTypeSendRunParams:
		var payload runParamsPayload

		err = json.Unmarshal(*objMap["payload"], &payload)
		if err != nil {
			return err
		}

		m.Payload = payload
		return nil
	case MsgTypePreviewStep:
		var payload previewStepPayload
		err = json.Unmarshal(*objMap["payload"], &payload)
		if err != nil {
			return err
		}

		m.Payload = payload
		return nil
	case MsgTypeStopStepPreview:
		var payload stopStepPreviewPayload
		err = json.Unmarshal(*objMap["payload"], &payload)
		if err != nil {
			return err
		}

		m.Payload = payload
		return nil
	case MsgTypeSendBPM:
		var payload sendBPMPayload
		err = json.Unmarshal(*objMap["payload"], &payload)
		if err != nil {
			return err
		}

		m.Payload = payload
		return nil
	}

	return fmt.Errorf("message type %s not recognized", x.MessageType)
}
