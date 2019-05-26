import uuid from "./uuid";

export type Scene = {
  id: string;
  defaultTimings: Timings;
  steps: Step[];
};

export type Timings = {
  duration: number | null;
  fadeUp: number | null;
  fadeDown: number | null;
};

export const computeTimings = (
  stepTimings: Timings,
  defaultTimings: Timings,
): Timings => ({
  duration:
    stepTimings.duration !== null
      ? stepTimings.duration
      : defaultTimings.duration,
  fadeUp:
    stepTimings.fadeUp !== null ? stepTimings.fadeUp : defaultTimings.fadeUp,
  fadeDown:
    stepTimings.fadeDown !== null
      ? stepTimings.fadeDown
      : stepTimings.fadeUp !== null
      ? stepTimings.fadeUp
      : defaultTimings.fadeDown,
});

export type Step = {
  id: string;
  values: {
    [K: string]: FixtureValue;
  };
  effects?: Effect[];
  timings: Timings;
};

export const NewStep = (): Step => ({
  id: uuid(),
  values: {},
  timings: {
    duration: null,
    fadeUp: null,
    fadeDown: null,
  },
});

export type FixtureValue = {
  dimmer?: number;
  color?: Color;
  strobe?: number;
};

type BaseEffect = {
  id: string;
  type: string;
  devices: string[];
};

export type Effect = DimmerSineEffect;

export enum EffectType {
  DimmerSineType = "DimmerSineType",
}

export type DimmerSineEffect = BaseEffect & {
  type: "DimmerSineType";
  min: number;
  max: number;
  phase: number;
  speed: number;
};

export const NewEffect = (type: EffectType): Effect => {
  switch (type) {
    case EffectType.DimmerSineType:
      return {
        id: uuid(),
        type: "DimmerSineType",
        devices: [],
        min: 0,
        max: 1,
        phase: 1,
        speed: 120,
      };
  }
};

export type Color = {
  R: number;
  G: number;
  B: number;
};

export enum RunMode {
  OneShot = 0,
  OneShotHold = 1,
  Cycle = 2,
}

export type RunParams = {
  runMode: RunMode;
};
