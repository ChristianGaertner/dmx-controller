import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { Effect } from "../../types";
import { getEffectForEditing } from "../../store/editor/selectors";
import { Dialog } from "../../components/Dialog";
import { deselectEffect, setEffect } from "../../store/editor/actions";
import { getNameForType } from "./EffectValue";
import { DimmerSine } from "./DimmerSine";
import { DeviceSelector } from "./DeviceSelector";

type StateProps = {
  effect: Effect | null;
};

type DispatchProps = {
  set: (effect: Effect) => void;
  close: () => void;
};

type Props = StateProps & DispatchProps;

const EffectEditorComp: React.FunctionComponent<Props> = ({
  effect,
  close,
  set,
}) =>
  effect && (
    <Dialog title={getNameForType(effect.type)} onRequestClose={close}>
      {effect.type === "DimmerSineType" && (
        <DimmerSine effect={effect} set={set} />
      )}
      <hr />
      <DeviceSelector
        deviceIds={effect.devices}
        onChange={ids => set({ ...effect, devices: ids })}
      />
    </Dialog>
  );

const mapStateToProps = (state: AppState): StateProps => ({
  effect: getEffectForEditing(state),
});

const mapDispatchToProps: DispatchProps = {
  close: deselectEffect,
  set: setEffect,
};

export const EffectEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EffectEditorComp);
