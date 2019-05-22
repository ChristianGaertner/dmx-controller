import * as React from "react";
import { Button, ButtonType } from "../components/Button";
import { connect } from "react-redux";
import { saveScene } from "../store/editor/actions";
import { AppState } from "../store";
import { getSelectedSceneId, isSaving } from "../store/editor/selectors";

type StateProps = {
  canSave: boolean;
  isSaving: boolean;
};

type DispatchProps = {
  save: () => void;
};

type Props = StateProps & DispatchProps;

const SaveButtonComp: React.FunctionComponent<Props> = ({
  save,
  isSaving,
  canSave,
}) =>
  canSave ? (
    <Button
      label="SAVE"
      type={ButtonType.BLUE}
      onClick={isSaving ? undefined : save}
    />
  ) : null;

const mapStateToProps = (state: AppState): StateProps => ({
  canSave: getSelectedSceneId(state) != null,
  isSaving: isSaving(state),
});

const mapDispatchToProps: DispatchProps = {
  save: saveScene,
};

export const SaveButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveButtonComp);
