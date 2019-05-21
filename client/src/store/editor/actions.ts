import { Timings } from "../../types";
import { BaseAction } from "../actionTypes";

export const SELECT_SCENE = "@editor/SELECT_SCENE";

export type EditorAction = SelectScene | EditTimings;

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

export const editTimings = (timings: Timings) => ({
  type: EDIT_TIMINGS,
  payload: { timings }
});
