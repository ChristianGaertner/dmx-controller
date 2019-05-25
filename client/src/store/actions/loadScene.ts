import { Scene } from "../../types";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../config";
import { BaseAction } from "../actionTypes";

export const LOAD_SCENE_REQUEST = "LOAD_SCENE_REQUEST";
export const LOAD_SCENE_RESPONSE = "LOAD_SCENE_RESPONSE";

export const LOAD_SCENE_LIST_REQUEST = "LOAD_SCENE_LIST_REQUEST";
export const LOAD_SCENE_LIST_RESPONSE = "LOAD_SCENE_LIST_RESPONSE";

export interface LoadSceneRequestAction extends BaseAction {
  type: typeof LOAD_SCENE_REQUEST;
  payload: {
    id: string;
  };
}

export interface LoadSceneResponseAction extends BaseAction {
  type: typeof LOAD_SCENE_RESPONSE;
  payload: {
    id: string;
    scene: Scene;
  };
}

export interface LoadSceneListRequestAction extends BaseAction {
  type: typeof LOAD_SCENE_LIST_REQUEST;
}

export interface LoadSceneListResponseAction extends BaseAction {
  type: typeof LOAD_SCENE_LIST_RESPONSE;
  payload: {
    scenes: string[];
  };
}

export const loadScene = (
  id: string,
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

export const loadSceneList = (): ThunkAction<
  void,
  AppState,
  null,
  LoadSceneListRequestAction | LoadSceneListResponseAction
> => async dispatch => {
  dispatch({ type: LOAD_SCENE_LIST_REQUEST });

  const res = await fetch(`${apiBasePath}/resources/scene`);
  const scenes = await res.json();

  dispatch({ type: LOAD_SCENE_LIST_RESPONSE, payload: { scenes } });
};
