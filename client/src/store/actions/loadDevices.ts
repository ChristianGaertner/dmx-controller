import { ThunkAction } from "redux-thunk";
import { AppState } from "../index";
import { apiBasePath } from "../config";
import { BaseAction } from "../actionTypes";

export const LOAD_DEVICES_REQUEST = "LOAD_DEVICES_REQUEST";
export const LOAD_DEVICES_RESPONSE = "LOAD_DEVICES_RESPONSE";

export interface LoadDevicesRequestAction extends BaseAction {
  type: typeof LOAD_DEVICES_REQUEST;
}

export interface LoadDevicesResponseAction extends BaseAction {
  type: typeof LOAD_DEVICES_RESPONSE;
  payload: {
    devices: string[];
  };
}

export const loadDevices = (): ThunkAction<
  void,
  AppState,
  null,
  LoadDevicesRequestAction | LoadDevicesResponseAction
> => async dispatch => {
  dispatch({ type: LOAD_DEVICES_REQUEST });

  const res = await fetch(`${apiBasePath}/resources/device`);
  const devices = await res.json();

  dispatch({ type: LOAD_DEVICES_RESPONSE, payload: { devices } });
};
