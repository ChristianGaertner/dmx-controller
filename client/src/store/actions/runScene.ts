import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "./config";
import { BaseAction } from "../actionTypes";

export const RUN_SCENE = "RUN_SCENE";

export interface RunSceneAction extends BaseAction {
  type: "RUN_SCENE";
  payload: {
    id: string | null;
  };
}

export const runScene = (
  id: string | null,
): ThunkAction<void, AppState, null, RunSceneAction> => async dispatch => {
  dispatch({ type: RUN_SCENE, payload: { id } });

  if (!!id) {
    return fetch(`${apiBasePath}/run/scene/${id}`, {
      method: "POST",
    });
  } else {
    return fetch(`${apiBasePath}/stop/scene`, {
      method: "POST",
    });
  }
};
