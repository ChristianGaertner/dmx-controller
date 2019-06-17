import { DefinedFixture, RunMode, RunParams, RunType, Scene } from "../types";
import { Action } from "./actionTypes";
import {
  LOAD_SCENE_LIST_REQUEST,
  LOAD_SCENE_LIST_RESPONSE,
  LOAD_SCENE_REQUEST,
  LOAD_SCENE_RESPONSE,
} from "./actions/loadScene";
import { RUN_SCENE } from "./actions/runScene";
import { editor } from "./editor/reducers";
import { websocket } from "./websocket/reducers";
import {
  LOAD_DEVICES_REQUEST,
  LOAD_DEVICES_RESPONSE,
} from "./actions/loadDevices";
import { SET_TAB, UiTab } from "./actions/setTab";
import {
  INIT_FIXTURES,
  ON_ACTIVE_CHANGE,
  SEND_RUN_PARAMS,
} from "./websocket/messages";

export { editor, websocket };

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

type RunningSceneStore = {
  sceneId: string | null;
  progress: number;
  requestedId: string | null;
  runParams: RunParams;
};

export const running = (
  state: RunningSceneStore = {
    sceneId: null,
    progress: 0,
    requestedId: null,
    runParams: {
      mode: RunMode.Cycle,
      type: RunType.UseStepTimings,
    },
  },
  action: Action,
) => {
  switch (action.type) {
    case RUN_SCENE:
      return {
        ...state,
        requestedId: action.payload.id,
      };
    case ON_ACTIVE_CHANGE:
      return {
        ...state,
        sceneId: action.payload.sceneId,
        progress: action.payload.progress,
      };
    case SEND_RUN_PARAMS:
      return {
        ...state,
        runParams: action.payload,
      };
    default:
      return state;
  }
};

type DeviceStore = {
  ids: string[];
  fixtureMapping: {
    [deviceId: string]: DefinedFixture;
  };
  isFetching: boolean;
};

const initialDeviceStore: DeviceStore = {
  ids: [],
  fixtureMapping: {},
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
    case INIT_FIXTURES:
      return {
        ...state,
        fixtureMapping: action.payload.fixtures,
      };
    default:
      return state;
  }
};

type UiState = {
  activeTab: UiTab;
};

export const ui = (
  state: UiState = { activeTab: UiTab.PROGRAM },
  action: Action,
): UiState => {
  switch (action.type) {
    case SET_TAB:
      return {
        ...state,
        activeTab: action.payload.tab,
      };
    default:
      return state;
  }
};
