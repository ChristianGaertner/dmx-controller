export type WsMessages = OnActiveChangeMessage;

export const ON_ACTIVE_CHANGE = "@websocket/ON_ACTIVE_CHANGE";
type OnActiveChangeMessage = {
  type: typeof ON_ACTIVE_CHANGE;
  payload: {
    sceneId: string | null;
  };
};
