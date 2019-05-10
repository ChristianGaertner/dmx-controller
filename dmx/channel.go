package dmx

type Channel struct {
	value uint16
}

func (c *Channel) ToSliceIndex() int {
	return int(c.value - 1)
}

func NewChannel(value uint16) Channel {
	if value < 1 || value > 512 {
		panic("Invalid channel value")
	}
	return Channel{value}
}

func NewChannelFromIndex(index int) Channel {
	if index < 0 || index > 511 {
		panic("Invalid channel index")
	}
	return NewChannel(uint16(index + 1))
}
