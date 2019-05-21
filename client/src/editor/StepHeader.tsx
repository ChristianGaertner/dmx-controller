import * as React from "react";
import { Timings } from "../types";
import { StepTimings } from "./StepTimings";

type Props = {
  index: number;
  timings?: Timings;
  defaultTimings: Timings;
};

export const StepHeader: React.FunctionComponent<Props> = ({
  index,
  timings,
  defaultTimings
}) => (
  <div className="mx-2 p-2">
    <span>Step {index + 1}</span>
    {!!timings && (
      <StepTimings timings={timings} defaultTimings={defaultTimings} />
    )}
  </div>
);
