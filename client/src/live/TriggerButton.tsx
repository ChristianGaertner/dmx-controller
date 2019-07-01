import * as React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { AppState } from "../store";
import { runScene, stopScene } from "../store/actions/runScene";
import {
  getRunParams,
  getSceneProgress,
  isSceneRunning,
} from "../store/selectors";
import { RunMode, RunParams, RunType, SceneMeta } from "../types";
import { sendRunParams } from "../store/websocket/messages";

type OwnProps = {
  scene: SceneMeta;
};

type StateProps = {
  active: boolean;
  progress: number;
  runParams: RunParams;
};

type DispatchProps = {
  runScene: (id: string, params: RunParams) => void;
  stopScene: (id: string) => void;
  setRunParams: (id: string, params: RunParams) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

const TriggerButtonComp: React.FunctionComponent<Props> = props => {
  return (
    <div
      className={cx(
        "relative rounded overflow-hidden mx-2 my-1 bg-gray-800 w-48 flex flex-col",
        {
          "bg-gray-800 text-white": !props.active,
          "bg-green-400 text-green-1000": props.active,
        },
      )}
    >
      <div className="flex text-sm">
        <button
          className={cx("w-1/2 py-1", {
            "bg-green-500": props.runParams.type === RunType.UseStepTimings,
          })}
          onClick={() =>
            props.setRunParams(props.scene.id, {
              ...props.runParams,
              type: RunType.UseStepTimings,
            })
          }
        >
          T
        </button>
        <button
          className={cx("w-1/2 py-1", {
            "bg-green-500": props.runParams.type === RunType.UseBeatTimings,
          })}
          onClick={() =>
            props.setRunParams(props.scene.id, {
              ...props.runParams,
              type: RunType.UseBeatTimings,
            })
          }
        >
          B
        </button>
      </div>
      <button
        className="px-4 py-2 overflow-hidden truncate"
        onClick={
          props.active
            ? () => props.stopScene(props.scene.id)
            : () => props.runScene(props.scene.id, props.runParams)
        }
      >
        {props.scene.name}
      </button>
      <div className="flex text-sm">
        <button
          className={cx("w-1/3 py-1", {
            "bg-green-500": props.runParams.mode === RunMode.OneShot,
          })}
          onClick={() =>
            props.setRunParams(props.scene.id, {
              ...props.runParams,
              mode: RunMode.OneShot,
            })
          }
        >
          S
        </button>
        <button
          className={cx("w-1/3 py-1", {
            "bg-green-500": props.runParams.mode === RunMode.OneShotHold,
          })}
          onClick={() =>
            props.setRunParams(props.scene.id, {
              ...props.runParams,
              mode: RunMode.OneShotHold,
            })
          }
        >
          H
        </button>
        <button
          className={cx("w-1/3 py-1", {
            "bg-green-500": props.runParams.mode === RunMode.Cycle,
          })}
          onClick={() =>
            props.setRunParams(props.scene.id, {
              ...props.runParams,
              mode: RunMode.Cycle,
            })
          }
        >
          C
        </button>
      </div>
      <div
        style={{
          width: `${Math.min(props.progress * 100, 100)}%`,
        }}
        className={cx("absolute bottom-0 left-0 h-1 bg-green-800", {
          hidden: !props.active,
        })}
      />
    </div>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  active: isSceneRunning(state, ownProps.scene.id),
  runParams: getRunParams(state, ownProps.scene.id) || {
    type: RunType.UseStepTimings,
    mode: RunMode.Cycle,
  },
  progress: getSceneProgress(state, ownProps.scene.id),
});

const mapDispatchToProps: DispatchProps = {
  runScene: runScene,
  stopScene: stopScene,
  setRunParams: sendRunParams,
};

export const TriggerButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TriggerButtonComp);
