import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { Effect } from "../types";
import { getEffectForEditing } from "../store/editor/selectors";
import { Dialog } from "../components/Dialog";
import { deselectEffect } from "../store/editor/actions";

type StateProps = {
  effect: Effect | null;
};

type DispatchProps = {
  close: () => void;
};

type Props = StateProps & DispatchProps;

const EffectEditorComp: React.FunctionComponent<Props> = ({ effect, close }) =>
  effect && (
    <Dialog title="Edit Effect" onRequestClose={close}>
      Effects cannot be edited right now!
    </Dialog>
  );

const mapStateToProps = (state: AppState): StateProps => ({
  effect: getEffectForEditing(state)
});

const mapDispatchToProps: DispatchProps = {
  close: deselectEffect
};

export const EffectEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EffectEditorComp);
