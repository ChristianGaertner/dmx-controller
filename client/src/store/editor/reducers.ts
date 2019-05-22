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
  RESET_SCENE
} from "./actions";
import { Action } from "../actionTypes";
import { NewStep, Scene } from "../../types";
import { LOAD_SCENE_RESPONSE } from "../actions/loadScene";

type EditorStore = {
  selectedScene: string | null;
  scene: Scene | null;
  saving: boolean;
  selectedFixtureValue: { stepId: string; deviceId: string } | null;
  selectedStepId: string | null;
};

const initialValue: EditorStore = {
  selectedScene: null,
  scene: null,
  saving: false,
  selectedFixtureValue: null,
  selectedStepId: null
};

export const editor = (
  state: EditorStore = initialValue,
  action: Action
): EditorStore => {
  switch (action.type) {
    case SELECT_SCENE:
      return {
        ...state,
        selectedScene: action.payload.id
      };
    case RESET_SCENE:
      return {
        ...state,
        scene: action.payload.scene
      };
    case LOAD_SCENE_RESPONSE:
      if (state.selectedScene !== action.payload.id) {
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
    case SELECT_FIXTURE_VALUE:
      return {
        ...state,
        selectedFixtureValue: action.payload
      };
    case SET_FIXTURE_VALUE: {
      if (!state.scene || !state.selectedFixtureValue) {
        return state;
      }

      const { stepId, deviceId } = state.selectedFixtureValue;

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
    case SELECT_STEP:
      return {
        ...state,
        selectedStepId: action.payload.stepId
      };
    case SET_STEP_TIMINGS: {
      if (!state.scene || !state.selectedStepId) {
        return state;
      }

      const { selectedStepId } = state;

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
      return state;
  }
};
