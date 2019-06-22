import * as React from "react";
import cx from "classnames";
import { Color, FixtureMode, FixtureModeUtil } from "../../types";
import { ControlSurface } from "./ControlSurface";
import { color2Hex } from "../../util";

type Props = {
  fixtureMode: FixtureMode;
  value: Color | undefined;
  onChange: (value: Color | undefined) => void;
};

export const ColorWheelControl: React.FunctionComponent<Props> = props => {
  if (!FixtureModeUtil.hasColorWheel(props.fixtureMode)) {
    return null;
  }

  return (
    <ControlSurface
      label="Color Wheel"
      defined={props.value !== undefined}
      onDeactivate={() => props.onChange(undefined)}
    >
      <div className="flex flex-wrap">
        {props.fixtureMode.colorMacros &&
          props.fixtureMode.colorMacros.map(macro => (
            <button
              key={color2Hex(macro.color)}
              className={cx("w-8 h-8 m-2 scale-0-8 transition border-8", {
                "scale-1": props.value === macro.color,
              })}
              style={{
                ...(props.value === macro.color && {
                  backgroundColor: color2Hex(macro.color),
                }),
                borderColor: color2Hex(macro.color),
              }}
              onClick={() => props.onChange(macro.color)}
            />
          ))}
      </div>
    </ControlSurface>
  );
};
