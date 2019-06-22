import * as React from "react";
import { Color, FixtureMode, FixtureModeUtil } from "../../types";
import { ControlSurface } from "./ControlSurface";
import { color2Hex, hex2Color } from "../../util";

type Props = {
  fixtureMode: FixtureMode;
  value: Color | undefined;
  onChange: (value: Color | undefined) => void;
};

export const ColorControl: React.FunctionComponent<Props> = props => {
  if (!FixtureModeUtil.hasFullColorRange(props.fixtureMode)) {
    return null;
  }

  return (
    <ControlSurface
      label="Color"
      defined={props.value !== undefined}
      onDeactivate={() => props.onChange(undefined)}
    >
      <input
        type="color"
        value={props.value ? color2Hex(props.value) : "#000000"}
        onChange={e => props.onChange(hex2Color(e.target.value))}
      />
    </ControlSurface>
  );
};
