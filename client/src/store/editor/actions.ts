import { Timings } from "../../types";
import { BaseAction } from "../actionTypes";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../actions/config";
import { getSceneForEditing } from "./selectors";

export const SELECT_SCENE = "@editor/SELECT_SCENE";

export type EditorAction =
  | SelectScene
  | EditTimings
  | SaveSceneRequest
  | SaveSceneResponse;

export interface SelectScene extends BaseAction {
  type: "@editor/SELECT_SCENE";
  payload: {
    id: string;
  };
}

export const selectSceneForEditing = (id: string) => ({
  type: SELECT_SCENE,
  payload: { id }
});

export const EDIT_TIMINGS = "@editor/EDIT_TIMINGS";

export interface EditTimings extends BaseAction {
  type: "@editor/EDIT_TIMINGS";
  payload: {
    timings: Timings;
  };
}

export const editTimings = (timings: Timings): EditTimings => ({
  type: EDIT_TIMINGS,
  payload: { timings }
});

export const SAVE_SCENE_REQUEST = "@editor/SAVE_SCENE_REQUEST";
export const SAVE_SCENE_RESPONSE = "@editor/SAVE_SCENE_RESPONSE";

export interface SaveSceneRequest extends BaseAction {
  type: "@editor/SAVE_SCENE_REQUEST";
}

export interface SaveSceneResponse extends BaseAction {
  type: "@editor/SAVE_SCENE_RESPONSE";
}

export const saveScene = (): ThunkAction<
  void,
  AppState,
  null,
  SaveSceneRequest | SaveSceneResponse
> => async (dispatch, getState) => {
  dispatch({ type: SAVE_SCENE_REQUEST });

  await fetch(`${apiBasePath}/resources/scene`, {
    method: "POST",
    body: JSON.stringify(getSceneForEditing(getState()))
  });

  dispatch({ type: SAVE_SCENE_RESPONSE });
};
