package server

import (
	"context"
	"encoding/json"
	"github.com/ChristianGaertner/dmx-controller/fixture"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"github.com/gorilla/mux"
	"net/http"
)

var scenes = make(map[string]*scene.Scene)

var runningScene *runningSceneInfo

type runningSceneInfo struct {
	ID   string
	stop context.CancelFunc
}

func ListenAndServe(ctx context.Context, devices *fixture.DeviceMap, timeCode <-chan types.TimeCode, onEval chan<- bool) error {

	r := mux.NewRouter()

	r.HandleFunc("/api/v1/resources/scene", getSceneIds).Methods("GET")
	r.HandleFunc("/api/v1/resources/scene/{id}", getSceneHandler).Methods("GET")
	r.HandleFunc("/api/v1/resources/scene", addSceneHandler).Methods("POST")

	r.HandleFunc("/api/v1/resources/device", getDeviceIds(devices)).Methods("GET")

	r.HandleFunc("/api/v1/run/scene/{id}", runSceneHandler(ctx, devices, timeCode, onEval)).Methods("POST")
	r.HandleFunc("/api/v1/stop/scene", stopSceneHandler()).Methods("POST")

	r.Use(panicMiddleware)
	r.Use(corsMiddleware)

	return http.ListenAndServe(":8080", r)
}

func addSceneHandler(w http.ResponseWriter, r *http.Request) {

	var incomingScene scene.Scene
	err := json.NewDecoder(r.Body).Decode(&incomingScene)
	if err != nil {
		w.WriteHeader(400)
	}

	scenes[incomingScene.ID] = &incomingScene
}

func getSceneHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	target, ok := scenes[id]
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	err := json.NewEncoder(w).Encode(target)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func getSceneIds(w http.ResponseWriter, r *http.Request) {
	var ids []string

	for id := range scenes {
		ids = append(ids, id)
	}

	err := json.NewEncoder(w).Encode(ids)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func runSceneHandler(ctx context.Context, devices *fixture.DeviceMap, timeCode <-chan types.TimeCode, onEval chan<- bool) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]

		if runningScene != nil {
			if runningScene.ID == id {
				return
			}
			runningScene.stop()
		}

		ctx, cancel := context.WithCancel(ctx)

		runningScene = &runningSceneInfo{
			ID:   id,
			stop: cancel,
		}

		target, ok := scenes[id]
		if !ok {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		onExit := make(chan bool)

		go scene.Run(ctx, target, devices, timeCode, onEval, onExit)

		go func() {
			<-onExit
			runningScene = nil
		}()

		w.WriteHeader(http.StatusAccepted)
	})
}

func stopSceneHandler() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if runningScene != nil {
			runningScene.stop()
			runningScene = nil
		}
		w.WriteHeader(http.StatusAccepted)
	})
}

func getDeviceIds(devices *fixture.DeviceMap) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := json.NewEncoder(w).Encode(devices.GetIdentifiers())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
}
