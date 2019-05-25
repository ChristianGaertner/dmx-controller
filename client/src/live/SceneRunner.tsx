import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { getRunningScene, getSceneList } from "../store/selectors";
import { runScene } from "../store/actions/runScene";
import { Button, ButtonType } from "../components/Button";
import { loadSceneList } from "../store/actions/loadScene";

type StateProps = {
  scenes: string[];
  runningScene: string | null;
};

type DispatchProps = {
  runScene: (id: string) => void;
  stopScene: () => void;
  loadScenes: () => void;
};

type Props = StateProps & DispatchProps;

const SceneRunnerComp: React.FunctionComponent<Props> = ({
  runningScene,
  runScene,
  stopScene,
  scenes,
  loadScenes,
}) => {
  React.useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 p-4">
        <span>{runningScene}</span>
        <Button
          type={ButtonType.RED}
          label="STOP"
          onClick={runningScene !== null ? stopScene : undefined}
        />
      </div>
      <div className="flex">
        <div />
        {scenes.map(id => (
          <div key={id}>
            <Button
              type={ButtonType.GREEN}
              label={`RUN #${id}`}
              onClick={runningScene === id ? undefined : () => runScene(id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  runningScene: getRunningScene(state),
  scenes: getSceneList(state),
});

const mapDispatchToProps: DispatchProps = {
  runScene: runScene,
  stopScene: () => runScene(null),
  loadScenes: loadSceneList,
};

export const SceneRunner = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SceneRunnerComp);
