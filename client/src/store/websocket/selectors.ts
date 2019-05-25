import { AppState } from "../index";
import { ConnectionState } from "./types";

export const getConnectionState = (state: AppState): ConnectionState =>
  state.websocket.connection.state;
