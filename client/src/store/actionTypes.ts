import {
  LoadSceneListRequestAction,
  LoadSceneListResponseAction,
  LoadSceneRequestAction,
  LoadSceneResponseAction,
} from "./actions/loadScene";
import { RunSceneAction } from "./actions/runScene";
import { EditorAction } from "./editor/actions";
import { Action as ReduxAction } from "redux";
import {
  LoadDevicesRequestAction,
  LoadDevicesResponseAction,
} from "./actions/loadDevices";

export interface BaseAction extends ReduxAction<string> {}

export type Action =
  | LoadSceneRequestAction
  | LoadSceneResponseAction
  | LoadSceneListRequestAction
  | LoadSceneListResponseAction
  | LoadDevicesRequestAction
  | LoadDevicesResponseAction
  | RunSceneAction
  | EditorAction;
