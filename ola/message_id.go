package ola

import "sync/atomic"

type UniqueID struct {
	counter uint32
}

func (c *UniqueID) Get() uint32 {
	for {
		val := atomic.LoadUint32(&c.counter)
		if atomic.CompareAndSwapUint32(&c.counter, val, val+1) {
			return val
		}
	}
}