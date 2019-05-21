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
  values: {
    [K: string]: FixtureValue;
  };
  effects?: Effect[];
  timings?: Timings;
};

export type FixtureValue = {
  dimmer?: number;
  color?: Color;
  strobe?: number;
};

export type Effect = {
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
