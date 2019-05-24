import { Scene } from "../types";
import { AppState } from "./index";
import { UiTab } from "./actions/setTab";

export const getScene = (
  state: AppState,
  { id }: { id: string },
): Scene | undefined => (state.scenes[id] || {}).scene;

export const getSceneList = (state: AppState): string[] =>
  state.sceneList.scenes || [];

export const getRunningScene = (state: AppState) => state.running;

export const getDeviceIds = (state: AppState): string[] => state.devices.ids;

export const getActiveTab = (state: AppState): UiTab => state.ui.activeTab;
