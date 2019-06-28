import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { getSceneList } from "../store/selectors";
import { loadSceneList } from "../store/actions/loadScene";
import { RunModeSelector } from "./RunModeSelector";
import { TriggerButton } from "./TriggerButton";
import { SceneMeta } from "../types";

type StateProps = {
  scenes: SceneMeta[];
};

type DispatchProps = {
  loadScenes: () => void;
};

type Props = StateProps & DispatchProps;

const SceneRunnerComp: React.FunctionComponent<Props> = ({
  scenes,
  loadScenes,
}) => {
  React.useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 p-4">
        <RunModeSelector />
      </div>
      <div className="flex">
        <div />
        {scenes.map(scene => (
          <div key={scene.id}>
            <TriggerButton scene={scene} />
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  scenes: getSceneList(state),
});

const mapDispatchToProps: DispatchProps = {
  loadScenes: loadSceneList,
};

export const SceneRunner = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SceneRunnerComp);
