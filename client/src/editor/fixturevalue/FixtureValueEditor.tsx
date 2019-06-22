import * as React from "react";
import { connect } from "react-redux";
import { FixtureMode, FixtureValue } from "../../types";
import { AppState } from "../../store";
import {
  getFixtureModeForEditing,
  getFixtureValueForEditing,
} from "../../store/editor/selectors";
import { Dialog } from "../../components/Dialog";
import {
  deselectFixtureValue,
  setFixtureValue,
} from "../../store/editor/actions";
import { DimmerControl } from "./DimmerControl";
import { PresetControl } from "./PresetControl";
import { GenericControl } from "./GenericControl";
import { ShutterControl } from "./ShutterControl";
import { ColorWheelControl } from "./ColorWheelControl";
import { ColorControl } from "./ColorControl";

type StateProps = {
  fixtureMode: FixtureMode | null;
  value: FixtureValue | null;
};

type DispatchProps = {
  close: () => void;
  set: (value: FixtureValue) => void;
};

type Props = StateProps & DispatchProps;

const FixtureValueEditorComp: React.FunctionComponent<Props> = ({
  value,
  fixtureMode,
  set,
  close,
}) =>
  value &&
  fixtureMode && (
    <Dialog title="Edit Fixture Value" onRequestClose={close}>
      <div className="p-4 flex flex-col">
        <DimmerControl
          fixtureMode={fixtureMode}
          value={value.dimmer}
          onChange={dimmer => set({ ...value, dimmer })}
        />
        <ColorControl
          fixtureMode={fixtureMode}
          value={value.color}
          onChange={color => set({ ...value, color })}
        />
        <ColorWheelControl
          fixtureMode={fixtureMode}
          value={value.color}
          onChange={color => set({ ...value, color })}
        />
        <ShutterControl
          fixtureMode={fixtureMode}
          value={value.shutter}
          onChange={shutter => set({ ...value, shutter })}
        />
        <PresetControl
          fixtureMode={fixtureMode}
          value={value.preset}
          onChange={preset => set({ ...value, preset })}
        />
        <GenericControl
          fixtureMode={fixtureMode}
          value={value.generic}
          onChange={generic => set({ ...value, generic })}
        />
      </div>
    </Dialog>
  );

const mapStateToProps = (state: AppState): StateProps => ({
  value: getFixtureValueForEditing(state),
  fixtureMode: getFixtureModeForEditing(state),
});

const mapDispatchToProps: DispatchProps = {
  close: deselectFixtureValue,
  set: setFixtureValue,
};

export const FixtureValueEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FixtureValueEditorComp);
