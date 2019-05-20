import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { getRunningScene } from "../store/selectors";
import { runScene } from "../store/actions/runScene";
import cx from "classnames";

type StateProps = {
  runningScene: string | null;
};

type DispatchProps = {
  runScene: (id: string) => void;
  stopScene: () => void;
};

type Props = StateProps & DispatchProps;

const SceneRunnerComp: React.FunctionComponent<Props> = ({
  runningScene,
  runScene,
  stopScene
}) => {
  const [scenes, setScenes] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:8080/api/v1/resources/scene")
      .then(r => r.json())
      .then(setScenes);
  }, []);

  return (
    <div className="flex flex-row">
      <button
        onClick={stopScene}
        className={cx("bg-red-900", {
          "opacity-75": runningScene === null
        })}
        disabled={runningScene === null}
      >
        STOP ALL
      </button>
      {scenes.map(id => (
        <button
          key={id}
          onClick={() => runScene(id)}
          className={cx("bg-green-900", {
            "opacity-75": id === runningScene
          })}
          disabled={id === runningScene}
        >
          RUN {id}
        </button>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  runningScene: getRunningScene(state)
});

const mapDispatchToProps: DispatchProps = {
  runScene: runScene,
  stopScene: () => runScene(null)
};

export const SceneRunner = connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneRunnerComp);
