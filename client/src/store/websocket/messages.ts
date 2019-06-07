import { BaseAction } from "../actionTypes";
import { RawMessage } from "./middleware";
import { RunMode, RunParams } from "../../types";

export type WsMessages = OnActiveChangeMessage | SendRunModeMessage;

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
});

export const WS_SEND_PREFIX = "@websocket/send/";

export const SEND_RUN_PARAMS = "@websocket/send/SEND_RUN_PARAMS";
type SendRunModeMessage = WsMessage<
  typeof SEND_RUN_PARAMS,
  {
    runMode: RunMode;
  }
>;
export const sendRunParams = (params: RunParams): SendRunModeMessage => ({
  type: SEND_RUN_PARAMS,
  payload: params,
  timestamp: new Date(),
});
