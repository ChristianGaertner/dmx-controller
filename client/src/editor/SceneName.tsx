import * as React from "react";
import { useSelector } from "react-redux";
import { getSceneForEditing } from "../store/editor/selectors";

export const SceneName: React.FunctionComponent = () => {
  const scene = useSelector(getSceneForEditing);

  if (!scene) {
    return null;
  }

  return (
    <div className="mx-8">
      <h1 className="text-3xl font-extrabold">{scene.meta.name}</h1>
    </div>
  );
};
