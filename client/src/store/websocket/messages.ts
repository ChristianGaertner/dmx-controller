import { BaseAction } from "../actionTypes";
import { RawMessage } from "./middleware";
import {
  DefinedFixture,
  RunParams,
  SerializedSetup,
  Stats,
  Step,
} from "../../types";

export type WsMessages =
  | OnProgressChangeMessage
  | SendRunModeMessage
  | PreviewStepMessage
  | StopStepPreviewMessage
  | InitFixtures;

export interface WsMessage<T extends string, P> extends BaseAction {
  type: T;
  payload: P;
  timestamp: Date;
  stats?: Stats;
}

export const ON_PROGRESS_CHANGE = "@websocket/ON_PROGRESS_CHANGE";
type OnProgressChangeMessage = WsMessage<
  typeof ON_PROGRESS_CHANGE,
  {
    progress: {
      [sceneID: string]: number;
    };
  }
>;

export const onProgressChangeMessage = (
  msg: RawMessage,
): OnProgressChangeMessage => ({
  type: ON_PROGRESS_CHANGE,
  payload: msg.payload,
  timestamp: new Date(msg.timestamp),
  hidden: true,
  stats: msg.stats,
});

export const INIT_FIXTURES = "@websocket/INIT_FIXTURES";
type InitFixtures = WsMessage<
  typeof INIT_FIXTURES,
  {
    fixtures: {
      [deviceId: string]: DefinedFixture;
    };
    setup: SerializedSetup;
  }
>;

export const initFixtures = (msg: RawMessage): InitFixtures => ({
  type: INIT_FIXTURES,
  payload: msg.payload,
  timestamp: new Date(msg.timestamp),
  stats: msg.stats,
});

export const WS_SEND_PREFIX = "@websocket/send/";

export const SEND_RUN_PARAMS = "@websocket/send/SEND_RUN_PARAMS";
type SendRunModeMessage = WsMessage<typeof SEND_RUN_PARAMS, RunParams>;
export const sendRunParams = (params: RunParams): SendRunModeMessage => ({
  type: SEND_RUN_PARAMS,
  payload: params,
  timestamp: new Date(),
});

export const PREVIEW_STEP = "@websocket/send/PREVIEW_STEP";
type PreviewStepMessage = WsMessage<typeof PREVIEW_STEP, { step: Step }>;
export const requestStepPreview = (step: Step): PreviewStepMessage => ({
  type: PREVIEW_STEP,
  payload: {
    step: step,
  },
  timestamp: new Date(),
});

export const STOP_STEP_PREVIEW = "@websocket/send/STOP_STEP_PREVIEW";
type StopStepPreviewMessage = WsMessage<
  typeof STOP_STEP_PREVIEW,
  { stepId: string }
>;
export const stopStepPreview = (stepId: string): StopStepPreviewMessage => ({
  type: STOP_STEP_PREVIEW,
  payload: {
    stepId,
  },
  timestamp: new Date(),
});
