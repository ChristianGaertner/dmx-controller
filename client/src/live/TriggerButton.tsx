import * as React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { AppState } from "../store";
import { runScene, stopScene } from "../store/actions/runScene";
import { Button, ButtonType } from "../components/Button";
import { getSceneProgress, isSceneRunning } from "../store/selectors";
import { SceneMeta } from "../types";

type OwnProps = {
  scene: SceneMeta;
};

type StateProps = {
  active: boolean;
  progress: number;
};

type DispatchProps = {
  runScene: (id: string) => void;
  stopScene: (id: string) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

const TriggerButtonComp: React.FunctionComponent<Props> = props => {
  return (
    <Button
      type={props.active ? ButtonType.GREEN : ButtonType.BLUE}
      label={props.scene.name}
      onClick={
        props.active
          ? () => props.stopScene(props.scene.id)
          : () => props.runScene(props.scene.id)
      }
      className="relative"
    >
      <div
        style={{
          width: `${Math.min(props.progress * 100, 100)}%`,
        }}
        className={cx("absolute bottom-0 left-0 h-1 bg-green-800", {
          hidden: !props.active,
        })}
      />
    </Button>
  );
};

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  active: isSceneRunning(state, ownProps.scene.id),
  progress: getSceneProgress(state, ownProps.scene.id),
});

const mapDispatchToProps: DispatchProps = {
  runScene: runScene,
  stopScene: stopScene,
};

export const TriggerButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TriggerButtonComp);
