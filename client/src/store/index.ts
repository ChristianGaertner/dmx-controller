import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import * as reducers from "./reducers";
import { Action } from "./actionTypes";
import { websocketMiddleware } from "./websocket/middleware";

const rootReducer = combineReducers(reducers);

export type AppState = ReturnType<typeof rootReducer>;

export const configureStore = () => {
  return createStore<AppState, Action, {}, {}>(
    rootReducer,
    applyMiddleware(
      thunk,
      websocketMiddleware(),
      createLogger({
        collapsed: true,
        predicate: (_, action) => !action.hidden,
      }),
    ),
  );
};
