import uuid from "./uuid";

export type Scene = {
  id: string;
  meta: SceneMeta;
  defaultTimings: Timings;
  steps: Step[] | null;
};

export const NewScene = (): Scene => {
  const id = uuid();

  return {
    id,
    meta: {
      id,
      name: "Untitiled Scene",
    },
    defaultTimings: {
      duration: 1000000000, // 1.0s
      fadeUp: 500000000, // 0.5s
      fadeDown: 500000000, // 0.5s
    },
    steps: [NewStep()],
  };
};

export type SceneMeta = {
  id: string;
  name: string;
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
  values?: {
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
  shutter?: Shutter;
  preset?: string;
  generic?: {
    [genericId: string]: number;
  };
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
  width: number;
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
        width: 0,
        speed: 120,
      };
  }
};

export type Color = {
  R: number;
  G: number;
  B: number;
};

export enum ShutterState {
  ShutterOpen = "ShutterOpen",
  ShutterClosed = "ShutterClosed",
  ShutterStrobe = "ShutterStrobe",
}

export type Shutter = {
  state: ShutterState;
  strobeFrequency: number;
};

export enum RunMode {
  OneShot = 0,
  OneShotHold = 1,
  Cycle = 2,
}

export enum RunType {
  UseStepTimings = 0,
  UseBeatTimings = 1,
}

export type RunParams = {
  type: RunType;
  mode: RunMode;
};

export enum CapabilityType {
  IntensityMasterDimmer = "IntensityMasterDimmer",
  IntensityRed = "IntensityRed",
  IntensityGreen = "IntensityGreen",
  IntensityBlue = "IntensityBlue",
  ShutterOpen = "ShutterOpen",
  ShutterClosed = "ShutterClosed",
  StrobeSlowToFast = "StrobeSlowToFast",
}

export type DefinedFixture = {
  definition: FixtureDefinition;
  activeMode: number;
};

export type FixtureDefinition = {
  id: string;
  modes: {
    [k: number]: FixtureMode;
  };
};

export type FixtureMode = {
  numChannels: number;
  capabilities:
    | { [k in keyof typeof CapabilityType]: ChannelTargetRange }
    | null;
  presets: { [presetId: string]: Preset } | null;
  generic: { [genericId: string]: Generic } | null;
  colorMacros: ColorMacroDefinition[] | null;
  hasVirtualDimmer: boolean;
};

export class FixtureModeUtil {
  static hasDimmer = (mode: FixtureMode) =>
    mode.capabilities &&
    (CapabilityType.IntensityMasterDimmer in mode.capabilities ||
      mode.hasVirtualDimmer);

  static hasFullColorRange = (mode: FixtureMode) =>
    mode.capabilities &&
    CapabilityType.IntensityRed in mode.capabilities &&
    CapabilityType.IntensityGreen in mode.capabilities &&
    CapabilityType.IntensityBlue in mode.capabilities;

  static getAvailableShutterStates = (
    mode: FixtureMode,
  ): ReadonlyArray<ShutterState> => {
    if (!mode.capabilities) {
      return [];
    }

    const states = [];

    if (CapabilityType.ShutterOpen in mode.capabilities) {
      states.push(ShutterState.ShutterOpen);
    }
    if (CapabilityType.ShutterClosed in mode.capabilities) {
      states.push(ShutterState.ShutterClosed);
    }
    if (CapabilityType.StrobeSlowToFast in mode.capabilities) {
      states.push(ShutterState.ShutterStrobe);
    }

    return states;
  };

  static hasShutter = (mode: FixtureMode) =>
    FixtureModeUtil.getAvailableShutterStates(mode).length > 0;

  static hasColorWheel = (mode: FixtureMode) =>
    mode.colorMacros && mode.colorMacros.length > 0;

  static defaultPresetId = (mode: FixtureMode): string | undefined => {
    const maybePreset = Object.entries(mode.presets || {}).find(
      ([id, preset]) => preset.default,
    );

    return maybePreset ? maybePreset[0] : undefined;
  };
}

type ColorMacroDefinition = {
  color: Color;
  name: string;
  target: ChannelTargetRange;
};

type Preset = {
  name: string;
  default: boolean;
  target: ChannelTargetRange;
};

type ChannelTargetRange = {
  channel: number;
  rangeStart: number;
  rangeEnd: number;
};

type Generic = {
  name: string;
  target: ChannelTargetRange;
};

export type SerializedSetup = {
  universes: { [k: string]: SerialisedUniverse };
};

export type SerialisedUniverse = {
  name: string;
  id: number;
  devices: {
    [deviceId: string]: SerialisedDeviceSetup;
  };
};

export type SerialisedDeviceSetup = {
  name: string;
  startAddress: number;
  fixtureId: string;
  mode: number;
};

export type Stats = {
  heapAlloc: number;
  heapSys: number;
};
