import { BaseAction } from "../actionTypes";

export type RawServerMessage = {
  type: string;
  serverTimestamp: string;
  payload: any;
};

export type WsMessages = OnActiveChangeMessage;

interface WsMessage<T extends string, P> extends BaseAction {
  type: T;
  payload: P;
  serverTimestamp: Date;
}

export const ON_ACTIVE_CHANGE = "@websocket/ON_ACTIVE_CHANGE";
type OnActiveChangeMessage = WsMessage<
  typeof ON_ACTIVE_CHANGE,
  {
    sceneId: string | null;
  }
>;

export const onActiveChangeMessage = (
  msg: RawServerMessage,
): OnActiveChangeMessage => ({
  type: ON_ACTIVE_CHANGE,
  payload: msg.payload,
  serverTimestamp: new Date(msg.serverTimestamp),
});
