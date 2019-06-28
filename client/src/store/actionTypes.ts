import {
  LoadSceneListRequestAction,
  LoadSceneListResponseAction,
  LoadSceneRequestAction,
  LoadSceneResponseAction,
} from "./actions/loadScene";
import { RunSceneAction, StopSceneAction } from "./actions/runScene";
import { EditorAction } from "./editor/actions";
import { Action as ReduxAction } from "redux";
import { SetTabAction } from "./actions/setTab";
import { WebsocketActions } from "./websocket/actions";

export interface BaseAction extends ReduxAction<string> {
  hidden?: boolean;
}

export type Action =
  | SetTabAction
  | LoadSceneRequestAction
  | LoadSceneResponseAction
  | LoadSceneListRequestAction
  | LoadSceneListResponseAction
  | RunSceneAction
  | StopSceneAction
  | EditorAction
  | WebsocketActions;
