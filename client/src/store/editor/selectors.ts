import { AppState } from "../index";
import { getScene } from "../selectors";
import { Scene } from "../../types";

export const getSelectedSceneId = (state: AppState) =>
  state.editor.selectedScene;

export const getSceneForEditing = (state: AppState): Scene | undefined => {
  const id = getSelectedSceneId(state);

  if (!!id) {
    return getScene(state, { id });
  }

  return;
};
