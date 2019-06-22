import * as React from "react";
import { FixtureMode } from "../../types";
import { byteRenderer, Slider } from "../components/Slider";
import { ControlSurface } from "./ControlSurface";

type Props = {
  fixtureMode: FixtureMode;
  value: { [genericId: string]: number } | undefined;
  onChange: (value: { [genericId: string]: number } | undefined) => void;
};

export const GenericControl: React.FunctionComponent<Props> = props => {
  if (props.fixtureMode.generic === null) {
    return null;
  }

  return (
    <>
      {Object.entries(props.fixtureMode.generic).map(([id, generic]) => (
        <ControlSurface
          label={generic.name}
          defined={props.value !== undefined && props.value[id] !== undefined}
          onDeactivate={() => {
            const v: { [genericId: string]: number } | undefined = {
              ...props.value,
            };
            delete v[id];

            if (Object.entries(v).length === 0) {
              return props.onChange(undefined);
            }

            return props.onChange(v);
          }}
        >
          <Slider
            value={!!props.value && id in props.value ? props.value[id] : 0}
            onChange={v => props.onChange({ ...props.value, [id]: v })}
            renderLabel={byteRenderer}
          />
        </ControlSurface>
      ))}
    </>
  );
};
