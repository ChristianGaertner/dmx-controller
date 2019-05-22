import { Scene } from "../types";
import { Action } from "./actionTypes";
import {
  LOAD_SCENE_LIST_REQUEST,
  LOAD_SCENE_LIST_RESPONSE,
  LOAD_SCENE_REQUEST,
  LOAD_SCENE_RESPONSE,
} from "./actions/loadScene";
import { RUN_SCENE } from "./actions/runScene";
import { editor } from "./editor/reducers";
import {
  LOAD_DEVICES_REQUEST,
  LOAD_DEVICES_RESPONSE,
} from "./actions/loadDevices";

export { editor };

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
          isFetching: true,
        },
      };
    case LOAD_SCENE_RESPONSE:
      return {
        ...scenes,
        [action.payload.id]: {
          isFetching: false,
          scene: action.payload.scene,
        },
      };
    default:
      return scenes;
  }
};

type SceneListStore = {
  isFetching: boolean;
  scenes: string[] | undefined;
};

export const sceneList = (
  state: SceneListStore = { isFetching: false, scenes: undefined },
  action: Action,
) => {
  switch (action.type) {
    case LOAD_SCENE_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_SCENE_LIST_RESPONSE:
      return {
        ...state,
        isFetching: false,
        scenes: action.payload.scenes,
      };
    default:
      return state;
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

type DeviceStore = {
  ids: string[];
  isFetching: boolean;
};

const initialDeviceStore: DeviceStore = {
  ids: [],
  isFetching: false,
};

export const devices = (
  state: DeviceStore = initialDeviceStore,
  action: Action,
) => {
  switch (action.type) {
    case LOAD_DEVICES_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_DEVICES_RESPONSE:
      return {
        ...state,
        isFetching: false,
        ids: action.payload.devices,
      };
    default:
      return state;
  }
};
