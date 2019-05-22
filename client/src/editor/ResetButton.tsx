import * as React from "react";
import { Button, ButtonType } from "../components/Button";
import { connect } from "react-redux";
import { resetScene } from "../store/editor/actions";
import { AppState } from "../store";
import { getSelectedSceneId } from "../store/editor/selectors";

type StateProps = {
  canReset: boolean;
};

type DispatchProps = {
  reset: () => void;
};

type Props = StateProps & DispatchProps;

const ResetButtonComp: React.FunctionComponent<Props> = ({ reset, canReset }) =>
  canReset ? (
    <Button label="RESET" type={ButtonType.ORANGE} onClick={reset} />
  ) : null;

const mapStateToProps = (state: AppState): StateProps => ({
  canReset: getSelectedSceneId(state) != null
});

const mapDispatchToProps: DispatchProps = {
  reset: resetScene
};

export const ResetButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetButtonComp);
