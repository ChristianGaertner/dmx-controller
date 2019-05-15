package dmx

type ChannelIndex uint16

type Channel struct {
	value ChannelIndex
}

func (c *Channel) ToSliceIndex() int {
	return int(c.value - 1)
}

func NewChannel(value ChannelIndex) Channel {
	if value < 1 || value > 512 {
		panic("Invalid channel value")
	}
	return Channel{value}
}

func NewChannelFromIndex(index int) Channel {
	if index < 0 || index > 511 {
		panic("Invalid channel index")
	}
	return NewChannel(ChannelIndex(index + 1))
}
