import { WsMessages } from "./messages";
import { BaseAction } from "../actionTypes";

export const WS_CONNECT = "@websocket/CONNECT";
interface WsConnect extends BaseAction {
  type: typeof WS_CONNECT;
}
export const wsConnect = (): WsConnect => ({
  type: WS_CONNECT,
});

export const WS_CONNECTED = "@websocket/CONNECTED";
interface WsConnected extends BaseAction {
  type: typeof WS_CONNECTED;
}
export const wsConnected = (): WsConnected => ({
  type: WS_CONNECTED,
});

export const WS_DISCONNECTED = "@websocket/DISCONNECTED";
interface WsDisconnected {
  type: typeof WS_DISCONNECTED;
}
export const wsDisconnected = (): WsDisconnected => ({
  type: WS_DISCONNECTED,
});

export type WebsocketActions =
  | WsConnect
  | WsConnected
  | WsDisconnected
  | WsMessages;
