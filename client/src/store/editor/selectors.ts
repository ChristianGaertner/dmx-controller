import { AppState } from "../index";
import { Effect, FixtureValue, Scene, Timings } from "../../types";
import { EditorUiStore } from "./reducers";

const getUiState = (state: AppState): EditorUiStore => state.editor.ui;

export const getSelectedSceneId = (state: AppState) =>
  getUiState(state).selectedScene;

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

  const uiState = getUiState(state);

  if (!uiState.selectedFixtureValue) {
    return null;
  }

  const { stepId, deviceId } = uiState.selectedFixtureValue;

  const step = scene.steps.find(step => step.id === stepId);
  if (!step) {
    return null;
  }

  return step.values[deviceId] || ({} as FixtureValue);
};

export const getTimingsForEditing = (state: AppState): Timings | null => {
  const scene = getSceneForEditing(state);
  if (!scene) {
    return null;
  }

  const uiState = getUiState(state);

  if (!uiState.selectedStepId) {
    return null;
  }

  const { selectedStepId } = uiState;

  const step = scene.steps.find(step => step.id === selectedStepId);

  if (!step) {
    return null;
  }

  return step.timings;
};

export const getEffectForEditing = (state: AppState): Effect | null => {
  const scene = getSceneForEditing(state);
  if (!scene) {
    return null;
  }

  const uiState = getUiState(state);
  const { selectedEffectId } = uiState;

  if (!selectedEffectId) {
    return null;
  }

  const step = scene.steps.find(
    step =>
      !!step.effects && step.effects.map(fx => fx.id).includes(selectedEffectId)
  );

  if (!step || !step.effects) {
    return null;
  }

  return step.effects.find(fx => fx.id === selectedEffectId) || null;
};
