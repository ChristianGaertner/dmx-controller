import * as React from "react";
import { DimmerSineEffect } from "../../types";
import { Input } from "../../components/Input";
import { Slider } from "../components/Slider";
import { Button, ButtonSize, ButtonType } from "../../components/Button";

enum PhasePreset {
  P0_360 = "P0_360",
  P0_n360 = "P0_n360",
  P0 = "P0",
}

type Props = {
  effect: DimmerSineEffect;
  set: (effect: DimmerSineEffect) => void;
};

export const DimmerSine: React.FunctionComponent<Props> = ({ effect, set }) => (
  <div className="flex">
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
          onClick={() =>
            set({ ...effect, phase: presetToPhase(PhasePreset.P0) })
          }
        />
      </div>
      <div className="my-2">
        <Slider
          label="Width"
          value={(effect.width + 1) / 2}
          onChange={width => set({ ...effect, width: width * 2 - 1 })}
          renderLabel={v => (v * 100).toFixed(0) + "%"}
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

    <div>
      <CurveVis effect={effect} />
    </div>
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

const CurveVis: React.FunctionComponent<{ effect: DimmerSineEffect }> = ({
  effect,
}) => {
  const [canvas, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const padding = 6;

    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;

    function valueToPy(v: number) {
      const py = (v * height) / 2 + height / 2;

      return height - py + padding;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 0, 1 ticks
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, valueToPy(0), width + 2 * padding, 1);
    ctx.fillRect(0, valueToPy(1), width + 2 * padding, 1);

    function getCurve(x: number) {
      let sin = Math.sin(x);

      if (sin < -1 * effect.width) {
        sin = -effect.width;
      }

      sin = (sin + effect.width) / (1 + effect.width);

      return effect.min + sin * (effect.max - effect.min);
    }

    function drawDeviceDots(px: number) {
      if (!ctx) {
        return;
      }
      const deviceOffset = (Math.PI * 2 * effect.phase) / effect.devices.length;
      for (let d = 0; d < effect.devices.length; d++) {
        const x = (px / width) * 2 * Math.PI;
        const y = getCurve(x + deviceOffset * d);
        const py = valueToPy(y);
        ctx.fillStyle = d === 0 ? "#fff" : "rgba(255,255,255,0.25)";
        ctx.fillRect(px + padding, py, 2, 2);
      }
    }

    for (let px = 0; px < width; px += 2) {
      drawDeviceDots(px);
    }
  }, [canvas, effect]);

  return <canvas ref={setCanvasRef} />;
};
