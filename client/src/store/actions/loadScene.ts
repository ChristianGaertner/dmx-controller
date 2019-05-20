import { Scene } from "../../types";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "./config";

export const LOAD_SCENE_REQUEST = "LOAD_SCENE_REQUEST";
export const LOAD_SCENE_RESPONSE = "LOAD_SCENE_RESPONSE";

export interface LoadSceneRequestAction {
  type: "LOAD_SCENE_REQUEST";
  payload: {
    id: string;
  };
}

export interface LoadSceneResponseAction {
  type: "LOAD_SCENE_RESPONSE";
  payload: {
    id: string;
    scene: Scene;
  };
}

export const loadScene = (
  id: string
): ThunkAction<
  void,
  AppState,
  null,
  LoadSceneRequestAction | LoadSceneResponseAction
> => async dispatch => {
  dispatch({ type: LOAD_SCENE_REQUEST, payload: { id } });

  const res = await fetch(`${apiBasePath}/resources/scene/${id}`);
  const scene = await res.json();

  dispatch({ type: LOAD_SCENE_RESPONSE, payload: { id, scene } });
};
