import { Action, BaseAction } from "../actionTypes";
import { NewScene, Scene } from "../../types";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../config";
import { selectSceneForEditing } from "../editor/actions";

export const ADD_SCENE = "@editor/ADD_SCENE";
export interface AddScene extends BaseAction {
  type: typeof ADD_SCENE;
  payload: {
    scene: Scene;
  };
}

export const addScene = (): ThunkAction<
  void,
  AppState,
  null,
  Action
> => async dispatch => {
  const scene = NewScene();
  await dispatch({ type: ADD_SCENE, payload: { scene } });

  await fetch(`${apiBasePath}/resources/scene`, {
    method: "POST",
    body: JSON.stringify(scene),
  });

  await dispatch(selectSceneForEditing(scene.id));
};
