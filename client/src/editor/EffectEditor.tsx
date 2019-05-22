import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { DimmerSineEffect, Effect } from "../types";
import { getEffectForEditing } from "../store/editor/selectors";
import { Dialog } from "../components/Dialog";
import { deselectEffect, setEffect } from "../store/editor/actions";
import { getNameForType } from "./EffectValue";
import { Input } from "../components/Input";
import { Select } from "../components/Select";

enum PhasePreset {
  P0_360 = "P0_360",
  P0_n360 = "P0_n360",
  P0 = "P0",
  CUSTOM = "CUSTOM",
}

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
    </Dialog>
  );

type DimmerSineProps = {
  effect: DimmerSineEffect;
  set: (effect: DimmerSineEffect) => void;
};

const DimmerSine: React.FunctionComponent<DimmerSineProps> = ({
  effect,
  set,
}) => (
  <div className="flex flex-col">
    <span>
      Min: ({(effect.min * 100).toFixed(0)}%){" "}
      <input
        type="range"
        min={0}
        max={1000}
        value={effect.min * 1000}
        onChange={e =>
          set({
            ...effect,
            min: parseFloat((parseFloat(e.target.value) / 1000).toFixed(2)),
          })
        }
      />
    </span>
    <span>
      Max: ({(effect.max * 100).toFixed(0)}%){" "}
      <input
        type="range"
        min={0}
        max={1000}
        value={effect.max * 1000}
        onChange={e =>
          set({
            ...effect,
            max: parseFloat((parseFloat(e.target.value) / 1000).toFixed(2)),
          })
        }
      />
    </span>
    <span>
      Phase:
      <Select
        value={phaseToPreset(effect.phase)}
        onChange={v =>
          set({ ...effect, phase: presetToPhase(v as PhasePreset) })
        }
      >
        <option value={PhasePreset.P0_360}>0..360</option>
        <option value={PhasePreset.P0_n360}>0..-360</option>
        <option value={PhasePreset.P0}>0</option>
        <option value={PhasePreset.CUSTOM}>
          CUSTOM (0..{(effect.phase * 360).toFixed(0)})
        </option>
      </Select>
      <input
        type="range"
        min={-1000}
        max={1000}
        value={effect.phase * 1000}
        onChange={e =>
          set({
            ...effect,
            phase: parseFloat((parseFloat(e.target.value) / 1000).toFixed(2)),
          })
        }
      />
    </span>
    <span>
      Speed (BPM){" "}
      <Input
        value={effect.speed.toString()}
        setValue={v => set({ ...effect, speed: parseFloat(v) })}
      />
    </span>
  </div>
);

const phaseToPreset = (phase: number): PhasePreset => {
  if (phase === 1) {
    return PhasePreset.P0_360;
  }
  if (phase === -1) {
    return PhasePreset.P0_n360;
  }
  if (phase === 0) {
    return PhasePreset.P0;
  }

  return PhasePreset.CUSTOM;
};

const presetToPhase = (phase: PhasePreset): number => {
  switch (phase) {
    case PhasePreset.P0_360:
      return 1;
    case PhasePreset.P0_n360:
      return -1;
    case PhasePreset.P0:
      return 0;
    default:
      return 0.0001;
  }
};

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
