import * as React from "react";
import { Button, ButtonType } from "../components/Button";
import { useSelector } from "react-redux";
import { getSelectedSceneId } from "../store/editor/selectors";
import { useActions } from "../store/util";
import { deleteScene } from "../store/actions/deleteScene";

export const DeleteButton: React.FunctionComponent = () => {
  const actions = useActions({ deleteScene });
  const id = useSelector(getSelectedSceneId);

  const onDelete = React.useCallback(() => {
    !!id && actions.deleteScene(id);
  }, [actions, id]);

  const canDelete = id !== null;

  if (!canDelete) {
    return null;
  }

  return <Button label="DELETE" type={ButtonType.RED} onClick={onDelete} />;
};
