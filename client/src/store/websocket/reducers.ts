import { Action } from "../actionTypes";
import { WS_CONNECT, WS_CONNECTED, WS_DISCONNECTED } from "./actions";
import { combineReducers } from "redux";
import { ConnectionState } from "./types";
import { WsMessage } from "./messages";
import { Stats } from "../../types";

type WebsocketState = {
  state: ConnectionState;
};

const initialState: WebsocketState = {
  state: ConnectionState.DISCONNECTED,
};

const connection = (state: WebsocketState = initialState, action: Action) => {
  switch (action.type) {
    case WS_CONNECT:
      return {
        ...state,
        state: ConnectionState.CONNECTING,
      };
    case WS_CONNECTED:
      return {
        ...state,
        state: ConnectionState.CONNECTED,
      };
    case WS_DISCONNECTED:
      return {
        ...state,
        state: ConnectionState.DISCONNECTED,
      };
    default:
      return state;
  }
};

type StatsState = Stats;
const zeroStats: StatsState = {
  heapAlloc: 0,
  heapSys: 0,
};
const stats = (state: StatsState = zeroStats, action: Action) => {
  if (action.type.startsWith("@websocket/")) {
    const wsAction = action as WsMessage<any, any>;
    return {
      ...state,
      ...wsAction.stats,
    };
  }

  return state;
};

export const websocket = combineReducers({ connection, stats });
