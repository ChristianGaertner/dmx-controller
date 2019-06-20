import { BaseAction } from "../actionTypes";

export enum UiTab {
  LIVE,
  PROGRAM,
  PATCH,
}

export const SET_TAB = "@ui/SET_TAB";

export interface SetTabAction extends BaseAction {
  type: typeof SET_TAB;
  payload: {
    tab: UiTab;
  };
}
export const setTab = (tab: UiTab): SetTabAction => ({
  type: SET_TAB,
  payload: {
    tab,
  },
});
