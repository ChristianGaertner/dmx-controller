import * as React from "react";
import cx from "classnames";
import { Timings } from "../types";

type Props = {
  timings: Timings;
  defaultTimings: Timings;
};

export const StepTimings: React.FunctionComponent<Props> = ({
  timings,
  defaultTimings
}) => (
  <div className="flex justify-between">
    <div
      className={cx(
        "text-blue-100 text-sm font-hairline flex flex-row items-center",
        {
          "text-blue-400": !timings.fadeUp
        }
      )}
    >
      <svg viewBox="0 0 20 20" className="h-2 w-2 fill-current mr-1">
        <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
          <g id="icon-shape">
            <polygon points="9 3.82842712 2.92893219 9.89949494 1.51471863 8.48528137 10 0 10.7071068 0.707106781 18.4852814 8.48528137 17.0710678 9.89949494 11 3.82842712 11 20 9 20 9 3.82842712" />
          </g>
        </g>
      </svg>
      {formatNanoSeconds(timings.fadeUp || defaultTimings.fadeUp)}s
    </div>

    <div
      className={cx({
        "text-blue-400": !timings.duration
      })}
    >
      {formatNanoSeconds(timings.duration || defaultTimings.duration)}s
    </div>

    <div
      className={cx(
        "text-blue-100 text-sm font-hairline flex flex-row items-center",
        {
          "text-blue-400": !timings.fadeDown
        }
      )}
    >
      {formatNanoSeconds(timings.fadeDown || defaultTimings.fadeDown)}s
      <svg viewBox="0 0 20 20" className="h-2 w-2 fill-current ml-1">
        <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
          <g id="icon-shape">
            <polygon points="9 16.1715729 2.92893219 10.1005051 1.51471863 11.5147186 10 20 10.7071068 19.2928932 18.4852814 11.5147186 17.0710678 10.1005051 11 16.1715729 11 0 9 0" />
          </g>
        </g>
      </svg>
    </div>
  </div>
);

const formatNanoSeconds = (nano: number | null) => (!!nano ? nano * 1e-9 : 0);
