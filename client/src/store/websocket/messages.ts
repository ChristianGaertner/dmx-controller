import { BaseAction } from "../actionTypes";
import { RawMessage } from "./middleware";
import { RunParams } from "../../types";

export type WsMessages =
  | OnActiveChangeMessage
  | SendRunModeMessage
  | InitFixtures;

export interface WsMessage<T extends string, P> extends BaseAction {
  type: T;
  payload: P;
  timestamp: Date;
}

export const ON_ACTIVE_CHANGE = "@websocket/ON_ACTIVE_CHANGE";
type OnActiveChangeMessage = WsMessage<
  typeof ON_ACTIVE_CHANGE,
  {
    sceneId: string | null;
    progress: number;
  }
>;

export const onActiveChangeMessage = (
  msg: RawMessage,
): OnActiveChangeMessage => ({
  type: ON_ACTIVE_CHANGE,
  payload: msg.payload,
  timestamp: new Date(msg.timestamp),
  hidden: true,
});

export const INIT_FIXTURES = "@websocket/INIT_FIXTURES";
type InitFixtures = WsMessage<
  typeof INIT_FIXTURES,
  {
    fixtureIds: {
      [k: string]: string;
    };
  }
>;

export const initFixtures = (msg: RawMessage): InitFixtures => ({
  type: INIT_FIXTURES,
  payload: msg.payload,
  timestamp: new Date(msg.timestamp),
});

export const WS_SEND_PREFIX = "@websocket/send/";

export const SEND_RUN_PARAMS = "@websocket/send/SEND_RUN_PARAMS";
type SendRunModeMessage = WsMessage<typeof SEND_RUN_PARAMS, RunParams>;
export const sendRunParams = (params: RunParams): SendRunModeMessage => ({
  type: SEND_RUN_PARAMS,
  payload: params,
  timestamp: new Date(),
});
