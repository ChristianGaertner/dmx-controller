package system

import (
	"context"
	"runtime"
	"sync"
	"time"
)

type Stats struct {
	HeapAlloc uint64 `json:"heapAlloc"`
	HeapSys   uint64 `json:"heapSys"`
}

type StatsMonitor interface {
	StartDaemon(ctx context.Context)

	Get() Stats
}

func NewStatsMonitor() StatsMonitor {
	return new(statsMonitor)
}

type statsMonitor struct {
	sync.RWMutex
	m runtime.MemStats

	stats Stats
}

func (s *statsMonitor) Get() Stats {
	s.RLock()
	defer s.RUnlock()
	return s.stats
}

func (s *statsMonitor) StartDaemon(ctx context.Context) {
	ticker := time.NewTicker(1 * time.Second)

	for {
		select {
		case <-ticker.C:
			runtime.ReadMemStats(&s.m)

			s.Lock()
			s.stats.HeapAlloc = s.m.HeapAlloc
			s.stats.HeapSys = s.m.HeapSys
			s.Unlock()
		case <-ctx.Done():
			return
		}
	}

}
