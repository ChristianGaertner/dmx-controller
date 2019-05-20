import {
  LoadSceneListRequestAction,
  LoadSceneListResponseAction,
  LoadSceneRequestAction,
  LoadSceneResponseAction
} from "./actions/loadScene";
import { RunSceneAction } from "./actions/runScene";
import { EditorAction } from "./editor/actions";

export type Action =
  | LoadSceneRequestAction
  | LoadSceneResponseAction
  | LoadSceneListRequestAction
  | LoadSceneListResponseAction
  | RunSceneAction
  | EditorAction;
