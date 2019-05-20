import { Scene } from "../types";
import { Action } from "./actionTypes";
import { LOAD_SCENE_REQUEST, LOAD_SCENE_RESPONSE } from "./actions/loadScene";
import { RUN_SCENE } from "./actions/runScene";

type SceneStore = {
  [K: string]: {
    scene?: Scene;
    isFetching: boolean;
  };
};

export const scenes = (scenes: SceneStore = {}, action: Action) => {
  switch (action.type) {
    case LOAD_SCENE_REQUEST:
      return {
        ...scenes,
        [action.payload.id]: {
          ...scenes[action.payload.id],
          isFetching: true
        }
      };
    case LOAD_SCENE_RESPONSE:
      return {
        ...scenes,
        [action.payload.id]: {
          isFetching: false,
          scene: action.payload.scene
        }
      };
    default:
      return scenes;
  }
};

export const running = (runningScene: string | null = null, action: Action) => {
  switch (action.type) {
    case RUN_SCENE:
      return action.payload.id;
    default:
      return runningScene;
  }
};
