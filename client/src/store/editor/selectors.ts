import { AppState } from "../index";
import { Scene } from "../../types";

export const getSelectedSceneId = (state: AppState) =>
  state.editor.selectedScene;

export const getSceneForEditing = (state: AppState): Scene | null =>
  state.editor.scene;
