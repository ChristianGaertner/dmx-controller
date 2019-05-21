import {
  EDIT_TIMINGS,
  SAVE_SCENE_REQUEST,
  SAVE_SCENE_RESPONSE,
  SELECT_SCENE,
  SELECT_FIXTURE_VALUE,
  SET_FIXTURE_VALUE,
  ADD_STEP
} from "./actions";
import { Action } from "../actionTypes";
import { NewStep, Scene } from "../../types";
import { LOAD_SCENE_RESPONSE } from "../actions/loadScene";

type EditorStore = {
  selectedScene: string | null;
  scene: Scene | null;
  saving: boolean;
  selectedFixtureValue: { stepId: string; deviceId: string } | null;
};

const initialValue: EditorStore = {
  selectedScene: null,
  scene: null,
  saving: false,
  selectedFixtureValue: null
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
    case SET_FIXTURE_VALUE:
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
          steps: steps
        } as Scene
      };
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
    default:
      return state;
  }
};
