import { FixtureValue, Scene, Timings } from "../../types";
import { BaseAction } from "../actionTypes";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../actions/config";
import { getSceneForEditing } from "./selectors";
import { getScene } from "../selectors";

export const SELECT_SCENE = "@editor/SELECT_SCENE";

export type EditorAction =
  | SelectScene
  | ResetScene
  | EditTimings
  | SaveSceneRequest
  | SaveSceneResponse
  | SelectFixtureValue
  | SetFixtureValue
  | AddStep
  | SelectStep
  | SetStepTimings;

interface SelectScene extends BaseAction {
  type: typeof SELECT_SCENE;
  payload: {
    id: string;
  };
}

export const selectSceneForEditing = (id: string) => ({
  type: SELECT_SCENE,
  payload: { id }
});

export const RESET_SCENE = "@editor/RESET_SCENE";
interface ResetScene extends BaseAction {
  type: typeof RESET_SCENE;
  payload: {
    scene: Scene;
  };
}

export const resetScene = (): ThunkAction<void, AppState, null, ResetScene> => (
  dispatch,
  getState
) => {
  const scene = getScene(getState(), {
    id: getState().editor.selectedScene || ""
  });
  if (!scene) {
    return;
  }
  dispatch({ type: RESET_SCENE, payload: { scene } });
};

export const EDIT_TIMINGS = "@editor/EDIT_TIMINGS";

interface EditTimings extends BaseAction {
  type: typeof EDIT_TIMINGS;
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

interface SaveSceneRequest extends BaseAction {
  type: typeof SAVE_SCENE_REQUEST;
}

interface SaveSceneResponse extends BaseAction {
  type: typeof SAVE_SCENE_RESPONSE;
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

export const SELECT_FIXTURE_VALUE = "@editor/SELECT_FIXTURE_VALUE";
interface SelectFixtureValue extends BaseAction {
  type: typeof SELECT_FIXTURE_VALUE;
  payload: {
    stepId: string;
    deviceId: string;
  } | null;
}

export const selectFixtureValue = (
  stepId: string,
  deviceId: string
): SelectFixtureValue => ({
  type: SELECT_FIXTURE_VALUE,
  payload: {
    stepId,
    deviceId
  }
});

export const deselectFixtureValue = (): SelectFixtureValue => ({
  type: SELECT_FIXTURE_VALUE,
  payload: null
});

export const SET_FIXTURE_VALUE = "@editor/SET_FIXTURE_VALUE";
interface SetFixtureValue extends BaseAction {
  type: typeof SET_FIXTURE_VALUE;
  payload: {
    value: FixtureValue;
  };
}

export const setFixtureValue = (value: FixtureValue) => ({
  type: SET_FIXTURE_VALUE,
  payload: {
    value
  }
});

export const SELECT_STEP = "@editor/SELECT_STEP";
interface SelectStep extends BaseAction {
  type: typeof SELECT_STEP;
  payload: {
    stepId: string | null;
  };
}

export const selectStep = (stepId: string): SelectStep => ({
  type: SELECT_STEP,
  payload: { stepId }
});

export const deselectStep = (): SelectStep => ({
  type: SELECT_STEP,
  payload: { stepId: null }
});

export const SET_STEP_TIMINGS = "@editor/SET_STEP_TIMINGS";
interface SetStepTimings extends BaseAction {
  type: typeof SET_STEP_TIMINGS;
  payload: {
    timings: Timings;
  };
}

export const setStepTimings = (timings: Timings): SetStepTimings => ({
  type: SET_STEP_TIMINGS,
  payload: { timings }
});

export const ADD_STEP = "@editor/ADD_STEP";
interface AddStep extends BaseAction {
  type: typeof ADD_STEP;
}

export const addStep = () => ({ type: ADD_STEP });
