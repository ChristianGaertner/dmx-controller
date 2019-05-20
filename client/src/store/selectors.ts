import { Scene } from "../types";
import { AppState } from "./index";

export const getScene = (
  state: AppState,
  { id }: { id: string }
): Scene | undefined => (state.scenes[id] || {}).scene;

export const getRunningScene = (state: AppState) => state.running;
