import { SELECT_SCENE } from "./actions";
import { Action } from "../actionTypes";

type EditorStore = {
  selectedScene: string | null;
};

export const editor = (
  state: EditorStore = { selectedScene: null },
  action: Action
) => {
  switch (action.type) {
    case SELECT_SCENE:
      return {
        ...state,
        selectedScene: action.payload.id
      };
    default:
      return state;
  }
};
