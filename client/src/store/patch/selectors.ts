import { AppState } from "../index";
import { getFixtureMode } from "../selectors";

export type DevicePatch = {
  startAddress: number;
  deviceId: string;
  name: string;
  numChannels: number;
};
export type UniversePatch = { [universeId: number]: DevicePatch[] };
export const getPatchedDevices = (state: AppState): UniversePatch => {
  const result: UniversePatch = {};

  for (let [, universe] of Object.entries(state.devices.setup.universes)) {
    result[universe.id] = Object.entries(universe.devices)
      .map(([deviceId, deviceSetup]) => ({
        deviceId,
        name: deviceSetup.name,
        startAddress: deviceSetup.startAddress,
        numChannels: (() => {
          const mode = getFixtureMode(state, deviceId);

          if (!mode) {
            return 0;
          }

          return mode.numChannels;
        })(),
      }))
      .sort((a, b) => a.startAddress - b.startAddress);
  }

  return result;
};
