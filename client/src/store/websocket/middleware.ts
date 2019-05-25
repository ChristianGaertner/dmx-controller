import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Action } from "../actionTypes";
import { WS_CONNECT } from "./actions";
import { websocketEndpoint } from "../config";
import { ON_ACTIVE_CHANGE } from "./messages";

class ReduxWebsocket {
  private websocket: WebSocket | null = null;

  connect(dispatch: Dispatch<Action>) {
    this.websocket = new WebSocket(websocketEndpoint);

    this.websocket.addEventListener("open", () => {
      console.log("OPEN");
    });
    this.websocket.addEventListener("message", event => {
      const message = JSON.parse(event.data) as { type: string; payload: any };
      switch (message.type) {
        case "ON_ACTIVE_CHANGE":
          return dispatch({
            type: ON_ACTIVE_CHANGE,
            payload: message.payload,
          });
        default:
          console.error("Unknown websocket message of type: " + message.type);
      }
    });
    this.websocket.addEventListener("close", () => {
      console.log("CLOSE");
    });
  }
}

const instance = new ReduxWebsocket();

export const websocketMiddleware = (): Middleware => {
  return ({ dispatch }: MiddlewareAPI) => next => (action: Action) => {
    if (action.type === WS_CONNECT) {
      instance.connect(dispatch);
    }

    return next(action);
  };
};
