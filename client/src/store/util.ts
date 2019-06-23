import { Action } from "./actionTypes";
import { useDispatch } from "react-redux";
import { DependencyList, useMemo } from "react";
import { ActionCreatorsMapObject, bindActionCreators } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "./index";

export function useActions<
  T extends ActionCreatorsMapObject<
    Action | ThunkAction<void, AppState, null, Action>
  >
>(actions: T, deps?: DependencyList): T {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators(actions, dispatch),
    deps ? [dispatch, ...deps] : [dispatch], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
