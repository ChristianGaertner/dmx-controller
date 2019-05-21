import * as React from "react";
import cx from "classnames";
import { Timings } from "../types";
import { formatNanoSeconds } from "./StepTimings";

type Props = {
  timings: Timings;
};

export const DefaultTimings: React.FunctionComponent<Props> = ({ timings }) => (
  <div className="mx-8 px-4 py-2 flex-grow flex justify-between items-center text-sm bg-blue-1000 rounded">
    <div className="flex flex-col items-center text-blue-100">
      <div className="text-sm font-hairline flex flex-row items-center text-lg">
        <svg viewBox="0 0 20 20" className="h-2 w-2 fill-current mr-1">
          <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="icon-shape">
              <polygon points="9 3.82842712 2.92893219 9.89949494 1.51471863 8.48528137 10 0 10.7071068 0.707106781 18.4852814 8.48528137 17.0710678 9.89949494 11 3.82842712 11 20 9 20 9 3.82842712" />
            </g>
          </g>
        </svg>
        {formatNanoSeconds(timings.fadeUp)}s
      </div>
      FadeUp
    </div>

    <div className="flex flex-col items-center text-blue-100">
      <span className="text-lg">
        {formatNanoSeconds(timings.duration)}s / {formatBPM(timings.duration)}
        BPM
      </span>
      <span>Duration</span>
    </div>

    <div className="flex flex-col items-center text-blue-100 ">
      <div className="text-sm font-hairline flex flex-row items-center text-lg">
        {formatNanoSeconds(timings.fadeDown)}s
        <svg viewBox="0 0 20 20" className="h-2 w-2 fill-current ml-1">
          <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="icon-shape">
              <polygon points="9 16.1715729 2.92893219 10.1005051 1.51471863 11.5147186 10 20 10.7071068 19.2928932 18.4852814 11.5147186 17.0710678 10.1005051 11 16.1715729 11 0 9 0" />
            </g>
          </g>
        </svg>
      </div>
      FadeDown
    </div>
  </div>
);

const formatBPM = (duration: number | null) =>
  (6e10 / (duration || 0)).toFixed(1);
