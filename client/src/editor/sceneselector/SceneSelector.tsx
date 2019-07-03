import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { selectSceneForEditing } from "../../store/editor/actions";
import { getSelectedSceneId } from "../../store/editor/selectors";
import { loadSceneList } from "../../store/actions/loadScene";
import { getSceneList } from "../../store/selectors";
import { SceneMeta } from "../../types";
import { addScene } from "../../store/actions/addScene";
import { SceneListItem } from "./SceneListItem";

type StateProps = {
  selectedScene: string | null;
  scenes: SceneMeta[];
};

type DispatchProps = {
  addScene: () => void;
  selectScene: (id: string) => void;
  loadScenes: () => void;
};

type Props = StateProps & DispatchProps;

const SceneSelectorComp: React.FunctionComponent<Props> = props => {
  const { loadScenes } = props;
  React.useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  return (
    <div className="flex flex-col flex-shrink-0">
      <span className="p-2 pr-6 border-b border-blue-900 mt-4">Scenes</span>
      {props.scenes.map(scene => (
        <SceneListItem key={scene.id} scene={scene} />
      ))}
      <button
        onClick={props.addScene}
        className="p-2 pr-6 flex items-center border-b border-blue-900 hover:bg-gray-900"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current mr-2">
          <g stroke="none" strokeWidth="1" fillRule="evenodd">
            <g>
              <path d="M11,9 L11,5 L9,5 L9,9 L5,9 L5,11 L9,11 L9,15 L11,15 L11,11 L15,11 L15,9 L11,9 Z M10,20 C15.5228475,20 20,15.5228475 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,15.5228475 4.4771525,20 10,20 Z M10,18 C14.418278,18 18,14.418278 18,10 C18,5.581722 14.418278,2 10,2 C5.581722,2 2,5.581722 2,10 C2,14.418278 5.581722,18 10,18 Z" />
            </g>
          </g>
        </svg>
        <span>NEW</span>
      </button>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  selectedScene: getSelectedSceneId(state),
  scenes: getSceneList(state),
});

const mapDispatchToProps: DispatchProps = {
  selectScene: selectSceneForEditing,
  addScene: addScene,
  loadScenes: loadSceneList,
};

export const SceneSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SceneSelectorComp);
