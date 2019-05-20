import {LoadSceneRequestAction, LoadSceneResponseAction} from "./actions/loadScene";
import {RunSceneAction} from "./actions/runScene";

export type Action = LoadSceneRequestAction | LoadSceneResponseAction | RunSceneAction;