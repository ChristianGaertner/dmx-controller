import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { RunMode, RunParams } from "../types";
import { sendRunParams } from "../store/websocket/messages";
import { Button, ButtonType } from "../components/Button";
import { getRunParams } from "../store/selectors";

type StateProps = {
  runParams: RunParams;
};

type DispatchProps = {
  setRunParams: (params: RunParams) => void;
};

type Props = StateProps & DispatchProps;

const RunModeSelectorComp: React.FunctionComponent<Props> = ({
  runParams,
  setRunParams,
}) => (
  <div>
    <Button
      type={
        runParams.mode === RunMode.OneShot ? ButtonType.ORANGE : ButtonType.BLUE
      }
      label="ONE SHOT"
      onClick={() => setRunParams({ ...runParams, mode: RunMode.OneShot })}
    />
    <Button
      type={
        runParams.mode === RunMode.OneShotHold
          ? ButtonType.ORANGE
          : ButtonType.BLUE
      }
      label="ONE SHOT HOLD"
      onClick={() => setRunParams({ ...runParams, mode: RunMode.OneShotHold })}
    />
    <Button
      type={
        runParams.mode === RunMode.Cycle ? ButtonType.ORANGE : ButtonType.BLUE
      }
      label="CYCLE"
      onClick={() => setRunParams({ ...runParams, mode: RunMode.Cycle })}
    />
  </div>
);

const mapStateToProps = (state: AppState): StateProps => ({
  runParams: getRunParams(state),
});

const mapDispatchToProps: DispatchProps = {
  setRunParams: sendRunParams,
};

export const RunModeSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RunModeSelectorComp);
