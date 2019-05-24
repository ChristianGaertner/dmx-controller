package server

import (
	"encoding/json"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/ChristianGaertner/dmx-controller/types"
	"github.com/gorilla/mux"
	"net/http"
)

var scenes = make(map[string]*scene.Scene)

func ListenAndServe(engine *run.Engine) error {

	r := mux.NewRouter()

	r.HandleFunc("/api/v1/resources/scene", getSceneIds).Methods("GET")
	r.HandleFunc("/api/v1/resources/scene/{id}", getSceneHandler).Methods("GET")
	r.HandleFunc("/api/v1/resources/scene", addSceneHandler).Methods("POST")

	r.HandleFunc("/api/v1/resources/device", getDeviceIds(engine)).Methods("GET")

	r.HandleFunc("/api/v1/run/scene/{id}", runSceneHandler(engine)).Methods("POST")
	r.HandleFunc("/api/v1/stop/scene", stopSceneHandler(engine)).Methods("POST")

	r.Use(panicMiddleware)
	r.Use(timeoutMiddleware)
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

func runSceneHandler(engine *run.Engine) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		target, ok := scenes[id]
		if !ok {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		engine.Run(target, run.UseStepTimings, types.RunModeCycle)
		w.WriteHeader(http.StatusAccepted)
	})
}

func stopSceneHandler(engine *run.Engine) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		engine.Stop()
		w.WriteHeader(http.StatusAccepted)
	})
}

func getDeviceIds(engine *run.Engine) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := json.NewEncoder(w).Encode(engine.DeviceMap.GetIdentifiers())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
}
