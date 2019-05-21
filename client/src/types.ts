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
    fadeDown: null
  }
});

export type FixtureValue = {
  dimmer?: number;
  color?: Color;
  strobe?: number;
};

export type Effect = {
  id: string;
  type: string;
  devices: string[];
} & {
  type: "DimmerSineType";
  min: number;
  max: number;
  phase: number;
  speed: number;
};

export type Color = {
  R: number;
  G: number;
  B: number;
};
