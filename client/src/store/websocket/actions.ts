import { WsMessages } from "./messages";

export const WS_CONNECT = "@websocket/CONNECT";
export const wsConnect = () =>
  ({
    type: WS_CONNECT,
  } as const);

export const WS_CONNECTED = "@websocket/CONNECTED";
export const wsConnected = () =>
  ({
    type: WS_CONNECTED,
  } as const);

export type WebsocketActions =
  | ReturnType<typeof wsConnect>
  | ReturnType<typeof wsConnected>
  | WsMessages;
