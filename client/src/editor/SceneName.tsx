import * as React from "react";
import { useSelector } from "react-redux";
import { getSceneForEditing } from "../store/editor/selectors";
import { SceneRenameButton } from "./SceneRenameButton";
import { useActions } from "../store/util";
import { setSceneMeta } from "../store/editor/actions";

export const SceneName: React.FunctionComponent = () => {
  const scene = useSelector(getSceneForEditing);
  const actions = useActions({ setSceneMeta });

  const onRename = React.useCallback(
    (name: string) => {
      actions.setSceneMeta({ name });
    },
    [actions],
  );

  if (!scene) {
    return null;
  }

  return (
    <div className="mx-8 flex items-center">
      <h1 className="text-3xl font-extrabold">{scene.meta.name}</h1>
      <SceneRenameButton name={scene.meta.name} onChange={onRename} />
    </div>
  );
};
