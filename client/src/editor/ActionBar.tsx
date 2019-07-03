import * as React from "react";
import { Button, ButtonType } from "../components/Button";
import { useSelector } from "react-redux";
import { useActions } from "../store/util";
import { deleteScene } from "../store/actions/deleteScene";
import { resetScene, saveScene } from "../store/editor/actions";
import { getSelectedSceneId, isSaving } from "../store/editor/selectors";

export const ActionBar: React.FunctionComponent = () => {
  const id = useSelector(getSelectedSceneId);
  const saving = useSelector(isSaving);

  const actions = useActions({ deleteScene, resetScene, saveScene });

  const onDelete = React.useCallback(() => {
    !saving && !!id && actions.deleteScene(id);
  }, [saving, actions, id]);

  const onReset = React.useCallback(() => {
    !saving && !!id && actions.resetScene();
  }, [saving, actions, id]);

  const onSave = React.useCallback(() => {
    !saving && !!id && actions.saveScene();
  }, [saving, actions, id]);

  if (!id) {
    return null;
  }

  return (
    <>
      <Button label="DELETE" type={ButtonType.RED} onClick={onDelete} />
      <Button label="RESET" type={ButtonType.ORANGE} onClick={onReset} />
      <Button label="SAVE" type={ButtonType.BLUE} onClick={onSave} />
    </>
  );
};
