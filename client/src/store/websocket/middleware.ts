import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Action } from "../actionTypes";
import { WS_CONNECT, wsConnected, wsDisconnected } from "./actions";
import { websocketEndpoint } from "../config";
import {
  initFixtures,
  onActiveChangeMessage,
  WS_SEND_PREFIX,
  WsMessage,
} from "./messages";

export type RawMessage = {
  type: string;
  timestamp: string;
  payload: any;
  stats?: any;
};

class ReduxWebsocket {
  private websocket: WebSocket | null = null;

  connect(dispatch: Dispatch<Action>) {
    this.websocket = new WebSocket(websocketEndpoint);

    this.websocket.addEventListener("open", () => {
      dispatch(wsConnected());
    });
    this.websocket.addEventListener("message", event => {
      const message = JSON.parse(event.data) as RawMessage;
      switch (message.type) {
        case "ON_ACTIVE_CHANGE":
          return dispatch(onActiveChangeMessage(message));
        case "INIT_FIXTURES":
          return dispatch(initFixtures(message));
        default:
          console.error("Unknown websocket message of type: " + message.type);
      }
    });
    this.websocket.addEventListener("error", e => {
      console.log(e);
    });
    this.websocket.addEventListener("close", () => {
      dispatch(wsDisconnected());
      this.websocket = null;
    });
  }

  send(action: WsMessage<string, any>) {
    if (this.websocket === null) {
      throw new Error("not connected");
    }

    this.websocket.send(
      JSON.stringify({
        ...action,
        type: action.type.substring(WS_SEND_PREFIX.length, action.type.length),
      }),
    );
  }
}

const instance = new ReduxWebsocket();

export const websocketMiddleware = (): Middleware => {
  return ({ dispatch }: MiddlewareAPI) => next => (action: Action) => {
    if (action.type === WS_CONNECT) {
      instance.connect(dispatch);
    }

    if (action.type.startsWith(WS_SEND_PREFIX)) {
      instance.send(action as WsMessage<string, any>);
    }

    return next(action);
  };
};
