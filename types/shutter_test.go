package types

import (
	"reflect"
	"testing"
)

func TestLerpShutter(t *testing.T) {
	type args struct {
		a           *Shutter
		b           *Shutter
		percentUp   float64
		percentDown float64
	}
	tests := []struct {
		name string
		args args
		want *Shutter
	}{
		{
			name: "normal",
			args: args{
				a: &Shutter{
					State: ShutterOpen,
				},
				b: &Shutter{
					State: ShutterClosed,
				},
				percentUp:   0.8,
				percentDown: 0.8,
			},
			want: &Shutter{
				State: ShutterClosed,
			},
		},
		{
			name: "with strobe",
			args: args{
				a: &Shutter{
					State:           ShutterStrobe,
					StrobeFrequency: 0,
				},
				b: &Shutter{
					State:           ShutterStrobe,
					StrobeFrequency: 1,
				},
				percentUp:   0.8,
				percentDown: 0.8,
			},
			want: &Shutter{
				State:           ShutterStrobe,
				StrobeFrequency: 0.8,
			},
		},
		{
			name: "merge",
			args: args{
				a: &Shutter{
					State: ShutterStrobe,
				},
				b: &Shutter{
					State: ShutterOpen,
				},
				percentUp:   0.5,
				percentDown: 0.5,
			},
			want: &Shutter{
				State: ShutterOpen,
			},
		},
		{
			name: "close shutter",
			args: args{
				a: &Shutter{
					State: ShutterStrobe,
				},
				b: &Shutter{
					State: ShutterClosed,
				},
				percentUp:   0.2,
				percentDown: 0.8,
			},
			want: &Shutter{
				State: ShutterClosed,
			},
		},
		{
			name: "open shutter, too early",
			args: args{
				a: &Shutter{
					State: ShutterClosed,
				},
				b: &Shutter{
					State: ShutterOpen,
				},
				percentUp:   0.2,
				percentDown: 0.8,
			},
			want: &Shutter{
				State: ShutterClosed,
			},
		},
		{
			name: "open shutter",
			args: args{
				a: &Shutter{
					State: ShutterClosed,
				},
				b: &Shutter{
					State: ShutterOpen,
				},
				percentUp:   0.7,
				percentDown: 0.2,
			},
			want: &Shutter{
				State: ShutterOpen,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := LerpShutter(tt.args.a, tt.args.b, tt.args.percentUp, tt.args.percentDown); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("LerpShutter() = %v, want %v", got, tt.want)
			}
		})
	}
}
