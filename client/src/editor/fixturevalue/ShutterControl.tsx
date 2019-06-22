import * as React from "react";
import cx from "classnames";
import {
  FixtureMode,
  FixtureModeUtil,
  Shutter,
  ShutterState,
} from "../../types";
import { ControlSurface } from "./ControlSurface";
import { Slider } from "../components/Slider";
import { Button, ButtonType } from "../../components/Button";

type Props = {
  fixtureMode: FixtureMode;
  value: Shutter | undefined;
  onChange: (value: Shutter | undefined) => void;
};

export const ShutterControl: React.FunctionComponent<Props> = props => {
  if (!FixtureModeUtil.hasShutter(props.fixtureMode)) {
    return null;
  }

  const value = props.value;

  return (
    <ControlSurface
      label="Shutter"
      defined={props.value !== undefined}
      onDeactivate={() => props.onChange(undefined)}
    >
      <div className="-ml-2">
        {FixtureModeUtil.getAvailableShutterStates(props.fixtureMode).map(
          state => (
            <Button
              label={getShutterLabel(state)}
              type={ButtonType.BLUE}
              onClick={
                !value || value.state !== state
                  ? () => props.onChange({ strobeFrequency: 0, state })
                  : undefined
              }
            />
          ),
        )}
      </div>

      <div
        className={cx("transition", {
          "opacity-50 pointer-events-none":
            !value || value.state !== ShutterState.ShutterStrobe,
          "opacity-100": value && value.state === ShutterState.ShutterStrobe,
        })}
      >
        <Slider
          value={(value && value.strobeFrequency) || 0}
          onChange={f =>
            value && props.onChange({ ...value, strobeFrequency: f })
          }
        />
      </div>
    </ControlSurface>
  );
};

const getShutterLabel = (state: ShutterState): string => {
  switch (state) {
    case ShutterState.ShutterOpen:
      return "OPEN";
    case ShutterState.ShutterClosed:
      return "CLOSED";
    case ShutterState.ShutterStrobe:
      return "STROBE";
  }
};
