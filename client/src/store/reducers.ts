import {
  FixtureDefinition,
  RunMode,
  RunParams,
  RunType,
  Scene,
  SceneMeta,
  SerialisedDeviceSetup,
  SerializedSetup,
} from "../types";
import { Action } from "./actionTypes";
import {
  LOAD_SCENE_LIST_REQUEST,
  LOAD_SCENE_LIST_RESPONSE,
  LOAD_SCENE_REQUEST,
  LOAD_SCENE_RESPONSE,
} from "./actions/loadScene";
import { editor } from "./editor/reducers";
import { websocket } from "./websocket/reducers";
import { SET_TAB, UiTab } from "./actions/setTab";
import {
  INIT_FIXTURES,
  ON_PROGRESS_CHANGE,
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
  scenes: SceneMeta[] | undefined;
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
  sceneIds: string[];
  progress: {
    [sceneID: string]: number;
  };
  runParams: RunParams;
};

export const running = (
  state: RunningSceneStore = {
    sceneIds: [],
    progress: {},
    runParams: {
      mode: RunMode.Cycle,
      type: RunType.UseStepTimings,
    },
  },
  action: Action,
): RunningSceneStore => {
  switch (action.type) {
    case ON_PROGRESS_CHANGE:
      return {
        ...state,
        sceneIds: Object.keys(action.payload.progress),
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
  deviceSetup: {
    [deviceId: string]: SerialisedDeviceSetup;
  };
  setup: SerializedSetup;
  isFetching: boolean;
};

const initialDeviceStore: DeviceStore = {
  deviceSetup: {},
  setup: {
    universes: {},
  },
  isFetching: false,
};

export const devices = (
  state: DeviceStore = initialDeviceStore,
  action: Action,
) => {
  switch (action.type) {
    case INIT_FIXTURES:
      return {
        ...state,
        setup: action.payload.setup,
        deviceSetup: Object.values(action.payload.setup.universes)
          .flatMap(u => Object.entries(u.devices))
          .reduce(
            (acc, [id, dev]) => ({
              ...acc,
              [id]: dev,
            }),
            state.deviceSetup,
          ),
      };
    default:
      return state;
  }
};

type FixtureStore = {
  [fixtureId: string]: FixtureDefinition;
};

export const fixtures = (state: FixtureStore = {}, action: Action) => {
  switch (action.type) {
    case INIT_FIXTURES:
      return {
        ...state,
        ...Object.values(action.payload.fixtures).reduce(
          (fixs, fixture) => ({
            ...fixs,
            [fixture.definition.id]: fixture.definition,
          }),
          {},
        ),
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
