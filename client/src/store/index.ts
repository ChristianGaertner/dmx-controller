import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import * as reducers from "./reducers";
import { Action } from "./actionTypes";

const rootReducer = combineReducers(reducers);

export type AppState = ReturnType<typeof rootReducer>;

export const configureStore = () => {
  return createStore<AppState, Action, {}, {}>(
    rootReducer,
    applyMiddleware(thunk)
  );
};
