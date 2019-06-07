package database

import (
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/tidwall/buntdb"
	"strings"
)

type Database interface {
	SetScene(scene *scene.Scene) error
	GetScene(id string) (*scene.Scene, error)
	GetSceneIds() ([]string, error)
	Close() error
}

type db struct {
	bunt *buntdb.DB
}

func Open(path string) (Database, error) {
	d, err := buntdb.Open(path)
	if err != nil {
		return nil, err
	}

	return &db{
		bunt: d,
	}, nil
}

func (d *db) Close() error {
	return d.bunt.Close()
}

func (d *db) SetScene(scene *scene.Scene) error {
	data, err := json.Marshal(scene)
	if err != nil {
		return err
	}
	return d.bunt.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(fmt.Sprintf("scene:%s", scene.ID), string(data), nil)
		return err
	})
}

func (d *db) GetScene(id string) (*scene.Scene, error) {
	var s scene.Scene

	err := d.bunt.View(func(tx *buntdb.Tx) error {
		val, err := tx.Get(fmt.Sprintf("scene:%s", id))
		if err != nil {
			return err
		}

		return json.Unmarshal([]byte(val), &s)
	})

	return &s, err
}

func (d *db) GetSceneIds() ([]string, error) {
	var ids []string

	err := d.bunt.View(func(tx *buntdb.Tx) error {
		return tx.AscendKeys("scene:*", func(key, value string) bool {
			ids = append(ids, strings.TrimPrefix(key, "scene:"))
			return true
		})
	})

	return ids, err
}