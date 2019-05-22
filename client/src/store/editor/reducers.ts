import {
  EDIT_TIMINGS,
  SAVE_SCENE_REQUEST,
  SAVE_SCENE_RESPONSE,
  SELECT_SCENE,
  SELECT_FIXTURE_VALUE,
  SET_FIXTURE_VALUE,
  ADD_STEP,
  SELECT_STEP,
  SET_STEP_TIMINGS,
  RESET_SCENE,
  SELECT_EFFECT
} from "./actions";
import { Action } from "../actionTypes";
import { NewStep, Scene } from "../../types";
import { LOAD_SCENE_RESPONSE } from "../actions/loadScene";

type EditorStore = {
  ui: EditorUiStore;
  scene: Scene | null;
  saving: boolean;
};

export type EditorUiStore = {
  selectedScene: string | null;
  selectedFixtureValue: { stepId: string; deviceId: string } | null;
  selectedStepId: string | null;
  selectedEffectId: string | null;
};

const uiInitialValue: EditorUiStore = {
  selectedScene: null,
  selectedFixtureValue: null,
  selectedStepId: null,
  selectedEffectId: null
};

const initialValue: EditorStore = {
  ui: uiInitialValue,
  scene: null,
  saving: false
};

export const editor = (
  state: EditorStore = initialValue,
  action: Action
): EditorStore => {
  switch (action.type) {
    case RESET_SCENE:
      return {
        ...state,
        scene: action.payload.scene
      };
    case LOAD_SCENE_RESPONSE:
      if (state.ui.selectedScene !== action.payload.id) {
        return state;
      }
      return {
        ...state,
        scene: action.payload.scene
      };
    case EDIT_TIMINGS:
      return {
        ...state,
        scene: {
          ...state.scene,
          defaultTimings: action.payload.timings
        } as Scene
      };
    case SAVE_SCENE_REQUEST:
      return {
        ...state,
        saving: true
      };
    case SAVE_SCENE_RESPONSE:
      return {
        ...state,
        saving: false
      };
    case SET_FIXTURE_VALUE: {
      if (!state.scene || !state.ui.selectedFixtureValue) {
        return state;
      }

      const { stepId, deviceId } = state.ui.selectedFixtureValue;

      const steps = state.scene.steps.map(step => {
        if (step.id !== stepId) {
          return step;
        }

        return {
          ...step,
          values: {
            ...step.values,
            [deviceId]: action.payload.value
          }
        };
      });

      return {
        ...state,
        scene: {
          ...state.scene,
          steps
        } as Scene
      };
    }
    case ADD_STEP:
      if (!state.scene) {
        return state;
      }
      return {
        ...state,
        scene: {
          ...state.scene,
          steps: [...state.scene.steps, NewStep()]
        }
      };
    case SET_STEP_TIMINGS: {
      if (!state.scene || !state.ui.selectedStepId) {
        return state;
      }

      const { selectedStepId } = state.ui;

      const steps = state.scene.steps.map(step => {
        if (step.id !== selectedStepId) {
          return step;
        }

        return {
          ...step,
          timings: action.payload.timings
        };
      });

      return {
        ...state,
        scene: {
          ...state.scene,
          steps
        }
      };
    }
    default:
      return {
        ...state,
        ui: uiReducer(state.ui, action)
      };
  }
};

const uiReducer = (state: EditorUiStore, action: Action): EditorUiStore => {
  switch (action.type) {
    case SELECT_SCENE:
      return {
        ...state,
        selectedScene: action.payload.id
      };
    case SELECT_FIXTURE_VALUE:
      return {
        ...state,
        selectedFixtureValue: action.payload
      };
    case SELECT_STEP:
      return {
        ...state,
        selectedStepId: action.payload.stepId
      };
    case SELECT_EFFECT:
      return {
        ...state,
        selectedEffectId: action.payload.effectId
      };
    default:
      return state;
  }
};
