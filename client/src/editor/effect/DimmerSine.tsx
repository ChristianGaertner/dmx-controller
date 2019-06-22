import * as React from "react";
import { DimmerSineEffect } from "../../types";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";
import { Slider } from "../components/Slider";
import { Button, ButtonSize, ButtonType } from "../../components/Button";

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
    <div className="my-2">
      <Slider
        label="Min"
        value={effect.min}
        onChange={min => set({ ...effect, min })}
      />
    </div>
    <div className="my-2">
      <Slider
        label="Max"
        value={effect.max}
        onChange={max => set({ ...effect, max })}
      />
    </div>
    <div className="flex flex-row items-center my-2">
      <Slider
        label="Phase"
        value={(effect.phase + 1) / 2}
        onChange={phase => set({ ...effect, phase: phase * 2 - 1 })}
        renderLabel={v => `0..${((v * 2 - 1) * 360).toFixed(0)}`}
      />
      <Button
        label="0..360"
        type={ButtonType.BLUE}
        size={ButtonSize.SMALL}
        onClick={() =>
          set({ ...effect, phase: presetToPhase(PhasePreset.P0_360) })
        }
      />
      <Button
        label="0..-360"
        type={ButtonType.BLUE}
        size={ButtonSize.SMALL}
        onClick={() =>
          set({ ...effect, phase: presetToPhase(PhasePreset.P0_n360) })
        }
      />
      <Button
        label="0"
        type={ButtonType.BLUE}
        size={ButtonSize.SMALL}
        onClick={() => set({ ...effect, phase: presetToPhase(PhasePreset.P0) })}
      />
    </div>
    <span>
      Speed (BPM){" "}
      <Input
        value={effect.speed.toString()}
        setValue={v => set({ ...effect, speed: parseFloat(v) })}
      />
    </span>
  </div>
);

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
