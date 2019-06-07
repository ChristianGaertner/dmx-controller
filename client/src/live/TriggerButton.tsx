import * as React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { AppState } from "../store";
import { runScene } from "../store/actions/runScene";
import { Button, ButtonType } from "../components/Button";
import { getRunningScene, getSceneProgress } from "../store/selectors";

type OwnProps = {
  sceneId: string;
};

type StateProps = {
  active: boolean;
  progress: number;
};

type DispatchProps = {
  runScene: (id: string) => void;
  stopScene: () => void;
};

type Props = OwnProps & StateProps & DispatchProps;

const TriggerButtonComp: React.FunctionComponent<Props> = props => {
  return (
    <Button
      type={props.active ? ButtonType.GREEN : ButtonType.BLUE}
      label={`${props.active ? "STOP" : "RUN"} #${props.sceneId}`}
      onClick={
        props.active ? props.stopScene : () => props.runScene(props.sceneId)
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
  active: getRunningScene(state) === ownProps.sceneId,
  progress: getSceneProgress(state),
});

const mapDispatchToProps: DispatchProps = {
  runScene: runScene,
  stopScene: () => runScene(null),
};

export const TriggerButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TriggerButtonComp);