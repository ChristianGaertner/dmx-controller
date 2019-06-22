import * as React from "react";
import { FixtureMode, FixtureModeUtil } from "../../types";
import { ControlSurface } from "./ControlSurface";
import { Select } from "../../components/Select";

type Props = {
  fixtureMode: FixtureMode;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export const PresetControl: React.FunctionComponent<Props> = props => {
  if (props.fixtureMode.presets === null) {
    return null;
  }

  return (
    <ControlSurface
      label="Preset"
      defined={props.value !== undefined}
      onDeactivate={() => props.onChange(undefined)}
    >
      <Select value={props.value || ""} onChange={props.onChange}>
        {FixtureModeUtil.defaultPresetId(props.fixtureMode) === undefined && (
          <option value="">Default</option>
        )}
        {Object.entries(props.fixtureMode.presets)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([presetId, preset]) => (
            <option key={presetId} value={presetId}>
              {preset.name}
            </option>
          ))}
      </Select>
    </ControlSurface>
  );
};
