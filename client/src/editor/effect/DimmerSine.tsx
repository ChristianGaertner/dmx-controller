import * as React from "react";
import { DimmerSineEffect } from "../../types";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";
import { Slider } from "../components/Slider";

enum PhasePreset {
  P0_360 = "P0_360",
  P0_n360 = "P0_n360",
  P0 = "P0",
  CUSTOM = "CUSTOM",
}

type Props = {
  effect: DimmerSineEffect;
  set: (effect: DimmerSineEffect) => void;
};

export const DimmerSine: React.FunctionComponent<Props> = ({ effect, set }) => (
  <div className="flex flex-col p-4">
    <span>
      Min
      <Slider value={effect.min} onChange={min => set({ ...effect, min })} />
    </span>
    <span>
      Max
      <Slider value={effect.max} onChange={max => set({ ...effect, max })} />
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
      <Slider
        value={(effect.phase + 1) / 2}
        onChange={phase => set({ ...effect, phase: phase * 2 - 1 })}
        renderLabel={v => `0..${((v * 2 - 1) * 360).toFixed(0)}`}
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
