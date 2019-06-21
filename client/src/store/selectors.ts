import { FixtureMode, RunParams, Scene } from "../types";
import { AppState } from "./index";
import { UiTab } from "./actions/setTab";

export const getScene = (
  state: AppState,
  { id }: { id: string },
): Scene | undefined => (state.scenes[id] || {}).scene;

export const getSceneList = (state: AppState): string[] =>
  state.sceneList.scenes || [];

export const getRunningScene = (state: AppState): string | null =>
  state.running.sceneId;

export const getSceneProgress = (state: AppState): number =>
  state.running.progress;

export const getDeviceIds = (state: AppState): string[] => state.devices.ids;

export const getActiveTab = (state: AppState): UiTab => state.ui.activeTab;

export const getRunParams = (state: AppState): RunParams =>
  state.running.runParams;

export const getFixtureMode = (
  state: AppState,
  deviceId: string,
): FixtureMode | null => {
  const definedFixture = state.devices.fixtureMapping[deviceId];

  if (!definedFixture) {
    return null;
  }

  return definedFixture.definition.modes[definedFixture.activeMode];
};

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
}; /*
  Object.entries(state.devices.setup)
    .map(([deviceId, patch]) => ({
      deviceId,
      patch,
      numChannels: (() => {
        const mode = getFixtureMode(state, deviceId);

        if (!mode) {
          return 0;
        }

        return mode.numChannels;
      })(),
    }))
    .sort((a, b) => a.patch.address - b.patch.address)
    .reduce(
      (universes, devicePatch) => ({
        ...universes,
        [devicePatch.patch.universeId]: [
          ...(universes[devicePatch.patch.universeId] || []),
          devicePatch,
        ],
      }),
      {} as UniversePatch,
    );
*/
