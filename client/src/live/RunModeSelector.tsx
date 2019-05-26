import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { RunMode } from "../types";
import { sendRunParams } from "../store/websocket/messages";
import { Button, ButtonType } from "../components/Button";

type StateProps = {};

type DispatchProps = {
  setRunMode: (mode: RunMode) => void;
};

type Props = StateProps & DispatchProps;

const RunModeSelectorComp: React.FunctionComponent<Props> = ({
  setRunMode,
}) => (
  <div>
    <Button
      type={ButtonType.BLUE}
      label="ONE SHOT"
      onClick={() => setRunMode(RunMode.OneShot)}
    />
    <Button
      type={ButtonType.BLUE}
      label="ONE SHOT HOLD"
      onClick={() => setRunMode(RunMode.OneShotHold)}
    />
    <Button
      type={ButtonType.BLUE}
      label="CYCLE"
      onClick={() => setRunMode(RunMode.Cycle)}
    />
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({});

const mapDispatchToProps: DispatchProps = {
  setRunMode: (runMode: RunMode) => sendRunParams({ runMode }),
};

export const RunModeSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RunModeSelectorComp);
