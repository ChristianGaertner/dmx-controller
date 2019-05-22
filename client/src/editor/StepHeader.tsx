import * as React from "react";
import { Timings } from "../types";
import { StepTimings } from "./StepTimings";
import { connect } from "react-redux";
import { selectStep } from "../store/editor/actions";
import { Action } from "../store/actionTypes";
import { Dispatch } from "redux";

type OwnProps = {
  id: string;
  index: number;
  timings?: Timings;
  defaultTimings: Timings;
};

type DispatchProps = {
  select: () => void;
};

type Props = OwnProps & DispatchProps;

const StepHeaderComp: React.FunctionComponent<Props> = ({
  index,
  timings,
  defaultTimings,
  select
}) => (
  <button
    className="w-full rounded border-2 border-transparent hover:border-blue-900"
    onClick={select}
  >
    <div className="mx-2 p-2">
      <span>Step {index + 1}</span>
      {!!timings && (
        <StepTimings timings={timings} defaultTimings={defaultTimings} />
      )}
    </div>
  </button>
);

const mapDispatchToProps = (
  dispatch: Dispatch<Action>,
  ownProps: OwnProps
): DispatchProps => ({
  select: () => dispatch(selectStep(ownProps.id))
});

export const StepHeader = connect(
  undefined,
  mapDispatchToProps
)(StepHeaderComp);
