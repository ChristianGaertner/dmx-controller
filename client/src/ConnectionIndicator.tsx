import * as React from "react";
import cx from "classnames";
import { connect } from "react-redux";
import { AppState } from "./store";
import { ConnectionState } from "./store/websocket/types";
import { getConnectionState } from "./store/websocket/selectors";
import { useActions } from "./store/util";
import { wsConnect } from "./store/websocket/actions";
import { SystemStatsIndicator } from "./stats/SystemStatsIndicator";

type StateProps = {
  state: ConnectionState;
};

type Props = StateProps;

const ConnectionIndicatorComp: React.FunctionComponent<Props> = ({ state }) => {
  const actions = useActions({ wsConnect: wsConnect });

  const onClick = React.useCallback(() => {
    if (state === ConnectionState.DISCONNECTED) {
      actions.wsConnect();
    }
  }, [actions, state]);

  return (
    <div className="flex flex-col">
      <button className="flex items-center px-2" onClick={onClick}>
        <div className="w-6 h-6 mr-1">
          <div
            className={cx("absolute ml-2 mt-2 rounded-full w-2 h-2", {
              "bg-green-400": state === ConnectionState.CONNECTED,
              "bg-red-400": state === ConnectionState.DISCONNECTED,
              "bg-yellow-400": state === ConnectionState.CONNECTING,
            })}
          />
          <div
            className={cx(
              "absolute ml-1 mt-1 rounded-full w-4 h-4 opacity-25",
              {
                "bg-green-200": state === ConnectionState.CONNECTED,
                "bg-red-200": state === ConnectionState.DISCONNECTED,
                "bg-yellow-200": state === ConnectionState.CONNECTING,
              },
            )}
          />
        </div>
        <span
          className={cx("w-32 text-left", {
            "text-green-300": state === ConnectionState.CONNECTED,
            "text-red-300": state === ConnectionState.DISCONNECTED,
            "text-yellow-300": state === ConnectionState.CONNECTING,
          })}
        >
          {getText(state)}
        </span>
      </button>
      {state === ConnectionState.CONNECTED && <SystemStatsIndicator />}
    </div>
  );
};

const getText = (state: ConnectionState): string => {
  switch (state) {
    case ConnectionState.CONNECTED:
      return "Connected";
    case ConnectionState.DISCONNECTED:
      return "Disconnected";
    case ConnectionState.CONNECTING:
      return "Connecting...";
  }
};

const mapStateToProps = (state: AppState): StateProps => ({
  state: getConnectionState(state),
});

export const ConnectionIndicator = connect(mapStateToProps)(
  ConnectionIndicatorComp,
);
