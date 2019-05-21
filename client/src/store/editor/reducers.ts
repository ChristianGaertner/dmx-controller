import { EDIT_TIMINGS, SELECT_SCENE } from "./actions";
import { Action } from "../actionTypes";
import { Scene } from "../../types";
import { LOAD_SCENE_RESPONSE } from "../actions/loadScene";

type EditorStore = {
  selectedScene: string | null;
  scene: Scene | null;
};

export const editor = (
  state: EditorStore = { selectedScene: null, scene: null },
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
    default:
      return state;
  }
};
