import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../config";
import { BaseAction } from "../actionTypes";

export const DELETE_SCENE_REQUEST = "DELETE_SCENE_REQUEST";
export const DELETE_SCENE_RESPONSE = "DELETE_SCENE_RESPONSE";

export interface DeleteSceneRequestAction extends BaseAction {
  type: typeof DELETE_SCENE_REQUEST;
  payload: {
    id: string;
  };
}

export interface DeleteSceneResponseAction extends BaseAction {
  type: typeof DELETE_SCENE_RESPONSE;
  payload: {
    id: string;
  };
}

export const deleteScene = (
  id: string,
): ThunkAction<
  void,
  AppState,
  null,
  DeleteSceneRequestAction | DeleteSceneResponseAction
> => async dispatch => {
  dispatch({ type: DELETE_SCENE_REQUEST, payload: { id } });

  await fetch(`${apiBasePath}/resources/scene/${id}`, {
    method: "DELETE",
  });

  dispatch({ type: DELETE_SCENE_RESPONSE, payload: { id } });
};
