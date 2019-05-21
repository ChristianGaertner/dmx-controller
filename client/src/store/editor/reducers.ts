import {
  EDIT_TIMINGS,
  SAVE_SCENE_REQUEST,
  SAVE_SCENE_RESPONSE,
  SELECT_SCENE
} from "./actions";
import { Action } from "../actionTypes";
import { Scene } from "../../types";
import { LOAD_SCENE_RESPONSE } from "../actions/loadScene";

type EditorStore = {
  selectedScene: string | null;
  scene: Scene | null;
  saving: boolean;
};

const initialValue: EditorStore = {
  selectedScene: null,
  scene: null,
  saving: false
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
    default:
      return state;
  }
};
