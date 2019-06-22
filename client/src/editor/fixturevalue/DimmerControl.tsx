import * as React from "react";
import { FixtureMode, FixtureModeUtil } from "../../types";
import { Slider } from "../components/Slider";
import { ControlSurface } from "./ControlSurface";

type Props = {
  fixtureMode: FixtureMode;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export const DimmerControl: React.FunctionComponent<Props> = props => {
  if (!FixtureModeUtil.hasDimmer(props.fixtureMode)) {
    return null;
  }

  return (
    <ControlSurface
      label="Dimmer"
      defined={props.value !== undefined}
      onDeactivate={() => props.onChange(undefined)}
    >
      <Slider value={props.value || 0} onChange={props.onChange} />
    </ControlSurface>
  );
};
