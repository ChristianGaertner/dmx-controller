package database

import (
	"encoding/json"
	"fmt"
	"github.com/ChristianGaertner/dmx-controller/scene"
	"github.com/tidwall/buntdb"
)

type Database interface {
	SetScene(scene *scene.Scene) error
	GetScene(id string) (*scene.Scene, error)
	DeleteScene(id string) error
	GetSceneList() ([]scene.Meta, error)
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

	metaData, err := json.Marshal(scene.Meta)
	if err != nil {
		return err
	}

	return d.bunt.Update(func(tx *buntdb.Tx) error {
		_, _, err := tx.Set(fmt.Sprintf("scene:%s", scene.ID), string(data), nil)
		if err != nil {
			return err
		}

		_, _, err = tx.Set(fmt.Sprintf("scene_meta:%s", scene.ID), string(metaData), nil)

		return err
	})
}

func (d *db) DeleteScene(id string) error {
	return d.bunt.Update(func(tx *buntdb.Tx) error {
		_, err := tx.Delete(fmt.Sprintf("scene:%s", id))
		if err != nil {
			return err
		}

		_, err = tx.Delete(fmt.Sprintf("scene_meta:%s", id))
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

func (d *db) GetSceneList() ([]scene.Meta, error) {
	var rawMeta []string

	err := d.bunt.View(func(tx *buntdb.Tx) error {
		return tx.AscendKeys("scene_meta:*", func(key, value string) bool {
			rawMeta = append(rawMeta, value)
			return true
		})
	})

	if err != nil {
		return nil, err
	}

	var metas []scene.Meta

	for _, s := range rawMeta {
		var meta scene.Meta

		err := json.Unmarshal([]byte(s), &meta)
		if err != nil {
			return nil, err
		}

		metas = append(metas, meta)
	}

	return metas, err
}
