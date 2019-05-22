import * as React from "react";
import { Timings } from "../types";
import { formatNanoSeconds, parseIntoNanoSeconds } from "./StepTimings";
import { connect } from "react-redux";
import { AppState } from "../store";
import { getSceneForEditing } from "../store/editor/selectors";
import { InlineInputField } from "../components/InlineInputField";
import { editTimings } from "../store/editor/actions";

type StateProps = {
  timings: Timings | null;
};

type DispatchProps = {
  save: (t: Timings) => void;
};

type Props = StateProps & DispatchProps;

const DefaultTimingsComp: React.FunctionComponent<Props> = ({
  timings,
  save,
}) =>
  timings && (
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
          <InlineInputField
            display={
              <span className="font-hairline">
                {formatNanoSeconds(timings.fadeUp)}s
              </span>
            }
            value={formatNanoSeconds(timings.fadeUp).toString()}
            onSave={v =>
              save({
                ...timings,
                fadeUp: parseIntoNanoSeconds(v),
              })
            }
          />
        </div>
        <span className="uppercase tracking-wide text-blue-600">FadeUp</span>
      </div>

      <div className="flex flex-col items-center text-blue-100">
        <span className="flex font-hairline text-lg">
          <InlineInputField
            display={
              <span className="font-hairline text-lg">
                {formatNanoSeconds(timings.duration)}s
              </span>
            }
            value={formatNanoSeconds(timings.duration).toString()}
            onSave={v =>
              save({
                ...timings,
                duration: parseIntoNanoSeconds(v),
              })
            }
          />
          &nbsp;/&nbsp;
          <InlineInputField
            display={
              <span className="font-hairline text-lg">
                {formatBPM(timings.duration)} BPM
              </span>
            }
            value={formatBPM(timings.duration).toString()}
            onSave={v => save({ ...timings, duration: parseBPM(v) })}
          />
        </span>
        <span className="uppercase tracking-wide text-blue-600">Duration</span>
      </div>

      <div className="flex flex-col items-center text-blue-100 ">
        <div className="text-sm font-hairline flex flex-row items-center text-lg">
          <InlineInputField
            display={
              <span className="font-hairline">
                {formatNanoSeconds(timings.fadeDown)}s
              </span>
            }
            value={formatNanoSeconds(timings.fadeDown).toString()}
            onSave={v =>
              save({
                ...timings,
                fadeDown: parseIntoNanoSeconds(v),
              })
            }
          />
          <svg viewBox="0 0 20 20" className="h-2 w-2 fill-current ml-1">
            <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
              <g id="icon-shape">
                <polygon points="9 16.1715729 2.92893219 10.1005051 1.51471863 11.5147186 10 20 10.7071068 19.2928932 18.4852814 11.5147186 17.0710678 10.1005051 11 16.1715729 11 0 9 0" />
              </g>
            </g>
          </svg>
        </div>
        <span className="uppercase tracking-wide text-blue-600">FadeDown</span>
      </div>
    </div>
  );

const formatBPM = (duration: number | null) =>
  parseFloat((6e10 / (duration || 0)).toFixed(1)).toString();

const parseBPM = (bpm: string): number => 6e10 / parseFloat(bpm);

const mapStateToProps = (state: AppState): StateProps => ({
  timings: (() => {
    const scene = getSceneForEditing(state);
    return scene && scene.defaultTimings;
  })(),
});

const mapDispatchToProps: DispatchProps = {
  save: editTimings,
};

export const DefaultTimings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultTimingsComp);
