import { AppState } from "../index";
import { FixtureValue, Scene } from "../../types";

export const getSelectedSceneId = (state: AppState) =>
  state.editor.selectedScene;

export const getSceneForEditing = (state: AppState): Scene | null =>
  state.editor.scene;

export const isSaving = (state: AppState): boolean => state.editor.saving;

export const getFixtureValueForEditing = (
  state: AppState
): FixtureValue | null => {
  const scene = getSceneForEditing(state);
  if (!scene) {
    return null;
  }
  if (!state.editor.selectedFixtureValue) {
    return null;
  }

  const { stepId, deviceId } = state.editor.selectedFixtureValue;

  const step = scene.steps.find(step => step.id === stepId);
  if (!step) {
    return null;
  }

  return step.values[deviceId];
};
