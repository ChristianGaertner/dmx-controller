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

func ListenAndServe(ctx context.Context, pool *fixture.DevicePool, timeCode <-chan types.TimeCode, onEval chan<- bool) error {

	r := mux.NewRouter()

	r.HandleFunc("/api/v1/resources/scene", addSceneHandler)
	r.HandleFunc("/api/v1/run/scene/{id}", runSceneHandler(ctx, pool, timeCode, onEval))
	r.HandleFunc("/api/v1/stop/scene", stopSceneHandler())

	r.Use(panicMiddleware)

	http.Handle("/", r)

	return http.ListenAndServe(":8080", nil)
}

func addSceneHandler(w http.ResponseWriter, r *http.Request) {

	var incomingScene scene.Scene
	err := json.NewDecoder(r.Body).Decode(&incomingScene)
	if err != nil {
		w.WriteHeader(400)
	}

	scenes[incomingScene.ID] = &incomingScene
}

func runSceneHandler(ctx context.Context, pool *fixture.DevicePool, timeCode <-chan types.TimeCode, onEval chan<- bool) http.HandlerFunc {
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
			ID: id,
			stop: cancel,
		}

		target, ok := scenes[id]
		if !ok {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		go scene.Run(ctx, target, pool, timeCode, onEval)
		w.WriteHeader(http.StatusAccepted)
	})
}

func stopSceneHandler() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if runningScene != nil {
			runningScene.stop()
		}
		w.WriteHeader(http.StatusAccepted)
	})
}