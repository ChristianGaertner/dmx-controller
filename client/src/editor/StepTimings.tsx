import * as React from "react";
import cx from "classnames";
import { computeTimings, Timings } from "../types";

type Props = {
  timings: Timings;
  defaultTimings: Timings;
};

export const StepTimings: React.FunctionComponent<Props> = ({
  timings: stepTimings,
  defaultTimings,
}) => {
  const timings = computeTimings(stepTimings, defaultTimings);
  return (
    <div className="flex-grow flex justify-between items-center">
      <div
        className={cx(
          "text-blue-100 text-sm font-hairline flex flex-row items-center",
          {
            "text-blue-400": stepTimings.fadeUp === null,
          },
        )}
      >
        <svg viewBox="0 0 20 20" className="h-2 w-2 fill-current mr-1">
          <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
            <g id="icon-shape">
              <polygon points="9 3.82842712 2.92893219 9.89949494 1.51471863 8.48528137 10 0 10.7071068 0.707106781 18.4852814 8.48528137 17.0710678 9.89949494 11 3.82842712 11 20 9 20 9 3.82842712" />
            </g>
          </g>
        </svg>
        {formatNanoSeconds(timings.fadeUp)}s
      </div>

      <div
        className={cx({
          "text-blue-400": stepTimings.duration === null,
        })}
      >
        {formatNanoSeconds(timings.duration)}s
      </div>

      <div
        className={cx(
          "text-blue-100 text-sm font-hairline flex flex-row items-center",
          {
            "text-blue-400": stepTimings.fadeDown === null,
          },
        )}
      >
        {formatNanoSeconds(timings.fadeDown)}s
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
};

export const formatNanoSeconds = (nano: number | null): string =>
  parseFloat((!!nano ? nano * 1e-9 : 0).toFixed(2)).toString();

export const parseIntoNanoSeconds = (seconds: string) =>
  parseFloat(seconds) * 1e9;
