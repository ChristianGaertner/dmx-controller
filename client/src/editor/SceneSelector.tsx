import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { selectSceneForEditing } from "../store/editor/actions";
import { getSelectedSceneId } from "../store/editor/selectors";
import { loadSceneList } from "../store/actions/loadScene";
import { getSceneList } from "../store/selectors";
import { Select } from "../components/Select";

type StateProps = {
  selectedScene: string | null;
  scenes: string[];
};

type DispatchProps = {
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
    <div className="flex flex-row">
      <div className="relative flex">
        <Select
          value={props.selectedScene || "-1"}
          onChange={props.selectScene}
        >
          {!props.selectedScene && <option value="-1">Select...</option>}
          {props.scenes.map(id => (
            <option key={id} value={id}>
              Scene #{id}
            </option>
          ))}
        </Select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  selectedScene: getSelectedSceneId(state),
  scenes: getSceneList(state)
});

const mapDispatchToProps: DispatchProps = {
  selectScene: selectSceneForEditing,
  loadScenes: loadSceneList
};

export const SceneSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneSelectorComp);
