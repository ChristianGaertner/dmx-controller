package server

import (
	"context"
	"encoding/json"
	"github.com/ChristianGaertner/dmx-controller/run"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

type handlers struct {
	engine *run.Engine
}

func ListenAndServe(ctx context.Context, addr string, engine *run.Engine, gracefulTimeout time.Duration) error {

	h := &handlers{
		engine: engine,
	}

	r := mux.NewRouter()

	r.HandleFunc("/api/v1/ws", h.handleWebsocket)
	r.HandleFunc("/api/v1/resources/scene", h.getSceneList).Methods(http.MethodGet)
	r.HandleFunc("/api/v1/resources/scene/{id}", h.getSceneHandler).Methods(http.MethodOptions)
	r.HandleFunc("/api/v1/resources/scene/{id}", h.deleteSceneHandler).Methods(http.MethodDelete)
	r.HandleFunc("/api/v1/resources/scene/{id}", h.getSceneHandler).Methods(http.MethodGet)
	r.HandleFunc("/api/v1/resources/scene", h.addSceneHandler).Methods(http.MethodPost)

	r.HandleFunc("/api/v1/run/scene/{id}", h.runSceneHandler).Methods(http.MethodPost)
	r.HandleFunc("/api/v1/stop/scene/{id}", h.stopSceneHandler).Methods(http.MethodPost)

	r.Use(panicMiddleware)
	r.Use(timeoutMiddleware)
	r.Use(corsMiddleware)

	srv := &http.Server{
		Addr:         addr,
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      r, // Pass our instance of gorilla/mux in.
	}

	// Run our server in a goroutine so that it doesn't block.
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	c := make(chan os.Signal, 1)

	// We'll accept graceful shutdowns when quit via SIGINT (Ctrl+C)
	// SIGKILL, SIGQUIT or SIGTERM (Ctrl+/) will not be caught.
	signal.Notify(c, os.Interrupt)

	// Block until we receive our signal.
	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(ctx, gracefulTimeout)
	defer cancel()
	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	return srv.Shutdown(ctx)
}

func (h *handlers) addSceneHandler(w http.ResponseWriter, r *http.Request) {
	var incomingScene scene.Scene
	err := json.NewDecoder(r.Body).Decode(&incomingScene)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	err = h.engine.Db.SetScene(&incomingScene)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}

}

func (h *handlers) deleteSceneHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	err := h.engine.Db.DeleteScene(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (h *handlers) getSceneHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	target, err := h.engine.Db.GetScene(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	err = json.NewEncoder(w).Encode(target)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func (h *handlers) getSceneList(w http.ResponseWriter, r *http.Request) {
	meta, err := h.engine.Db.GetSceneList()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
	}

	err = json.NewEncoder(w).Encode(meta)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func (h *handlers) runSceneHandler(w http.ResponseWriter, r *http.Request) {

	var body struct {
		Params run.SceneRunParams `json:"params"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	id := mux.Vars(r)["id"]
	target, err := h.engine.Db.GetScene(id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	h.engine.Run(target, body.Params)
	w.WriteHeader(http.StatusAccepted)
}

func (h *handlers) stopSceneHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	h.engine.Stop(id)
	w.WriteHeader(http.StatusAccepted)
}
