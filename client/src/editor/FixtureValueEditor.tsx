import * as React from "react";
import { connect } from "react-redux";
import { Color, FixtureValue } from "../types";
import { AppState } from "../store";
import { getFixtureValueForEditing } from "../store/editor/selectors";
import { Dialog } from "../components/Dialog";
import { deselectFixtureValue, setFixtureValue } from "../store/editor/actions";

type StateProps = {
  value: FixtureValue | null;
};

type DispatchProps = {
  close: () => void;
  set: (value: FixtureValue) => void;
};

type Props = StateProps & DispatchProps;

const FixtureValueEditorComp: React.FunctionComponent<Props> = ({
  value,
  set,
  close,
}) =>
  value && (
    <Dialog title="Edit Fixture Value" onRequestClose={close}>
      <div className="p-4 flex flex-col">
        <ValueRow
          active={value.dimmer !== undefined}
          label="Dimmer"
          value={(value.dimmer || 0) * 1000}
          onChange={(v: number) =>
            set({
              ...value,
              dimmer: v && parseFloat((v / 1000).toFixed(2)),
            })
          }
          inputProps={{ type: "range", min: 0, max: 1000 }}
        />
        <ValueRow
          active={value.color !== undefined}
          label="Color"
          value={value.color ? Color2Hex(value.color) : "#000000"}
          onChange={(v: string) => set({ ...value, color: Hex2Color(v) })}
          inputProps={{ type: "color" }}
        />
        <ValueRow
          active={value.strobe !== undefined}
          label="Strobe"
          value={(value.strobe || 0) * 1000}
          onChange={(v: number) =>
            set({
              ...value,
              strobe: v && parseFloat((v / 1000).toFixed(2)),
            })
          }
          inputProps={{ type: "range", min: 0, max: 1000 }}
        />
      </div>
    </Dialog>
  );

type ValueRowProps = {
  active: boolean;
  value: any;
  onChange: (value: any | undefined) => void;
  label: string;
  inputProps: any;
};

const ValueRow: React.FunctionComponent<ValueRowProps> = ({
  active,
  value,
  onChange,
  label,
  inputProps,
}) => (
  <div className="flex items-center w-1/2 my-2">
    <span className="bg-gray-800 flex justify-start items-center p-2 flex-grow rounded-l">
      <input
        type="checkbox"
        checked={active}
        onChange={e => onChange(e.target.checked ? value : undefined)}
      />
      <label className="ml-2">{label}</label>
    </span>
    <div className="ml-auto flex flex-row w-1/2">
      <div className="mx-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          {...inputProps}
        />
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  value: getFixtureValueForEditing(state),
});

const mapDispatchToProps: DispatchProps = {
  close: deselectFixtureValue,
  set: setFixtureValue,
};

export const FixtureValueEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FixtureValueEditorComp);

const Color2Hex = (color: Color): string => {
  let r = (color.R * 255).toString(16);
  if (r.length < 2) {
    r = "0" + r;
  }
  let g = (color.G * 255).toString(16);
  if (g.length < 2) {
    g = "0" + g;
  }
  let b = (color.B * 255).toString(16);
  if (b.length < 2) {
    b = "0" + b;
  }

  return `#${r}${g}${b}`;
};

const Hex2Color = (hex: string): Color | undefined => {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!res) {
    return undefined;
  }

  return {
    R: parseInt(res[1], 16) / 255,
    G: parseInt(res[2], 16) / 255,
    B: parseInt(res[3], 16) / 255,
  };
};
