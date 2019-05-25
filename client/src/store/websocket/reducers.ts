import { Action } from "../actionTypes";
import { WS_CONNECT, WS_CONNECTED, WS_DISCONNECTED } from "./actions";
import { combineReducers } from "redux";
import { ConnectionState } from "./types";

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

export const websocket = combineReducers({ connection });
