import * as React from "react";
import { Timings } from "../types";

type Props = {
  index: number;
  timings?: Timings;
};

export const StepHeader: React.FunctionComponent<Props> = ({
  index,
  timings
}) => (
  <div className="mx-2 p-2">
    <span>Step {index + 1}</span>
    {!!timings && (
      <div className="flex justify-between">
        <span>U {formatNanoSeconds(timings.fadeUp)}</span>

        <span>{formatNanoSeconds(timings.duration)}</span>
        <span>{formatNanoSeconds(timings.fadeDown)} D</span>
      </div>
    )}
  </div>
);

const formatNanoSeconds = (nano: number | null) => (!!nano ? nano * 1e-9 : 0);
