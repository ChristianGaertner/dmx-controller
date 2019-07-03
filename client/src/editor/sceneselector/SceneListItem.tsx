import * as React from "react";
import cx from "classnames";
import { SceneMeta } from "../../types";
import { useActions } from "../../store/util";
import { selectSceneForEditing } from "../../store/editor/actions";
import { useSelector } from "react-redux";
import { getSelectedSceneId } from "../../store/editor/selectors";

type Props = {
  scene: SceneMeta;
};

export const SceneListItem: React.FunctionComponent<Props> = props => {
  const isSelected = useSelector(getSelectedSceneId) === props.scene.id;
  const actions = useActions({
    selectScene: selectSceneForEditing,
  });

  return (
    <button
      onClick={() => actions.selectScene(props.scene.id)}
      className="p-2 pr-6 flex items-center border-b border-blue-900 hover:bg-gray-900"
    >
      <div
        className={cx("h-2 w-2 bg-blue-300 rounded-full", {
          invisible: !isSelected,
        })}
      />
      <span className="pl-2">{props.scene.name}</span>
    </button>
  );
};
