import { FixtureDefinition, FixtureMode, RunParams, Scene } from "../types";
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

export const getFixtureDefinition = (
  state: AppState,
  id: string,
): FixtureDefinition | null => state.fixtures[id];

export const getFixtureMode = (
  state: AppState,
  deviceId: string,
): FixtureMode | null => {
  const deviceSetup = state.devices.deviceSetup[deviceId];
  if (!deviceSetup) return null;

  const def = getFixtureDefinition(state, deviceSetup.fixtureId);
  if (!def) return null;

  return def.modes[deviceSetup.mode];
};

export const getDeviceName = (state: AppState, id: string): string | null => {
  const d = state.devices.deviceSetup[id];

  return !!d ? d.name : null;
};
