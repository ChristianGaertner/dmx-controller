import * as React from "react";
import { useSelector } from "react-redux";
import { getSelectedSceneId } from "../store/editor/selectors";

export const NoSelection: React.FunctionComponent = () => {
  const id = useSelector(getSelectedSceneId);

  if (!!id) {
    return null;
  }

  return <div>Please select a scene from the list or create a new one!</div>;
};
