package fixture

import (
	"reflect"
	"testing"

	"github.com/ChristianGaertner/dmx-controller/types"
)

func Test_lerpGeneric(t *testing.T) {
	type args struct {
		a           map[types.GenericID]types.DimmerValue
		b           map[types.GenericID]types.DimmerValue
		percentUp   float64
		percentDown float64
	}
	tests := []struct {
		name string
		args args
		want map[types.GenericID]types.DimmerValue
	}{
		{
			name: "nils",
			args: args{
				a: nil,
				b: nil,
				percentDown: 0.3,
				percentUp: 0.3,
			},
			want: nil,
		},
		{
			name: "lerps correctly",
			args: args{
				a: map[types.GenericID]types.DimmerValue{
					"foo": 0,
					"bar": 0.5,
				},
				b: map[types.GenericID]types.DimmerValue{
					"foo": 0,
					"bar": 1,
					"baz": 1,
				},
				percentDown: 0.5,
				percentUp: 0.5,
			},
			want: map[types.GenericID]types.DimmerValue{
				"foo": 0,
				"bar": 0.75,
				"baz": 0.5,
			},
		},
		{
			name: "lerps correctly with different percentDown/percentUp",
			args: args{
				a: map[types.GenericID]types.DimmerValue{
					"foo": 0,
					"bar": 0.5,
					"new": 1,
				},
				b: map[types.GenericID]types.DimmerValue{
					"foo": 0,
					"bar": 1,
					"baz": 1,
					"new": 0,
				},
				percentDown: 1,
				percentUp: 0.5,
			},
			want: map[types.GenericID]types.DimmerValue{
				"foo": 0,
				"bar": 0.75,
				"baz": 0.5,
				"new": 0,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := lerpGeneric(tt.args.a, tt.args.b, tt.args.percentUp, tt.args.percentDown); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("lerpGeneric() = %v, want %v", got, tt.want)
			}
		})
	}
}
