import { AppState } from "../index";
import { ConnectionState } from "./types";
import { Stats } from "../../types";

export const getConnectionState = (state: AppState): ConnectionState =>
  state.websocket.connection.state;

export const getSystemStats = (state: AppState): Stats => state.websocket.stats;
