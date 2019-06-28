import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../config";
import { BaseAction } from "../actionTypes";

export const RUN_SCENE = "RUN_SCENE";

export interface RunSceneAction extends BaseAction {
  type: "RUN_SCENE";
  payload: {
    id: string;
  };
}

export const runScene = (
  id: string,
): ThunkAction<void, AppState, null, RunSceneAction> => async dispatch => {
  dispatch({ type: RUN_SCENE, payload: { id } });

  return fetch(`${apiBasePath}/run/scene/${id}`, {
    method: "POST",
  });
};

export const STOP_SCENE = "STOP_SCENE";

export interface StopSceneAction extends BaseAction {
  type: "STOP_SCENE";
  payload: {
    id: string;
  };
}

export const stopScene = (
  id: string,
): ThunkAction<void, AppState, null, StopSceneAction> => async dispatch => {
  dispatch({ type: STOP_SCENE, payload: { id } });

  return fetch(`${apiBasePath}/stop/scene/${id}`, {
    method: "POST",
  });
};
