import * as React from "react";
import { connect } from "react-redux";
import { computeTimings, Timings } from "../types";
import { AppState } from "../store";
import {
  getSceneForEditing,
  getTimingsForEditing,
} from "../store/editor/selectors";
import { Dialog } from "../components/Dialog";
import { deselectStep, setStepTimings } from "../store/editor/actions";
import { formatNanoSeconds, parseIntoNanoSeconds } from "./StepTimings";
import cx from "classnames";
import { Input } from "../components/Input";

type StateProps = {
  timings: Timings | null;
  defaultTimings: Timings;
};

type DispatchProps = {
  close: () => void;
  setTimings: (timings: Timings) => void;
};

type Props = StateProps & DispatchProps;

const StepEditorComp: React.FunctionComponent<Props> = ({
  timings: stepTimings,
  defaultTimings,
  setTimings,
  close,
}) => {
  if (!stepTimings) {
    return null;
  }

  const timings = computeTimings(stepTimings, defaultTimings);

  return (
    <Dialog title="Edit Step" onRequestClose={close}>
      <div className="p-4 flex flex-row">
        <div className="flex flex-col mx-4 items-center">
          <span>
            <input
              type="checkbox"
              className="mr-2"
              checked={stepTimings.fadeUp === null}
              onChange={e => {
                const fadeUp = e.target.checked ? null : timings.fadeUp;
                setTimings({ ...stepTimings, fadeUp });
              }}
            />
            Use Scene FadeUp
          </span>
          <span
            className={cx({
              "text-blue-800": stepTimings.fadeUp === null,
            })}
          >
            <Input
              value={formatNanoSeconds(timings.fadeUp)}
              setValue={value =>
                setTimings({
                  ...stepTimings,
                  fadeUp: parseIntoNanoSeconds(value),
                })
              }
              disabled={stepTimings.fadeUp === null}
            />
          </span>
        </div>

        <div className="flex flex-col mx-4 items-center">
          <span>
            <input
              type="checkbox"
              className="mr-2"
              checked={stepTimings.duration === null}
              onChange={e => {
                const duration = e.target.checked ? null : timings.duration;
                setTimings({ ...stepTimings, duration });
              }}
            />
            Use Scene Duration
          </span>
          <span
            className={cx({
              "text-blue-800": stepTimings.duration === null,
            })}
          >
            <Input
              value={formatNanoSeconds(timings.duration)}
              setValue={value =>
                setTimings({
                  ...stepTimings,
                  duration: parseIntoNanoSeconds(value),
                })
              }
              disabled={stepTimings.duration === null}
            />
          </span>
        </div>

        <div className="flex flex-col mx-4 items-center">
          <span>
            <input
              type="checkbox"
              className="mr-2"
              checked={stepTimings.fadeDown === null}
              onChange={e => {
                const fadeDown = e.target.checked ? null : timings.fadeDown;
                setTimings({ ...stepTimings, fadeDown });
              }}
            />
            Use{" "}
            {stepTimings.fadeUp === null ? "Scene Fade Down" : "Step Fade Up"}
          </span>
          <span
            className={cx({
              "text-blue-800": stepTimings.fadeDown === null,
            })}
          >
            <Input
              value={formatNanoSeconds(timings.fadeDown)}
              setValue={value =>
                setTimings({
                  ...stepTimings,
                  fadeDown: parseIntoNanoSeconds(value),
                })
              }
              disabled={stepTimings.fadeDown === null}
            />
          </span>
        </div>
      </div>
    </Dialog>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  timings: getTimingsForEditing(state),
  defaultTimings: (() => {
    const scene = getSceneForEditing(state);

    if (!scene) {
      return {} as Timings;
    }

    return scene.defaultTimings;
  })(),
});

const mapDispatchToProps: DispatchProps = {
  close: deselectStep,
  setTimings: setStepTimings,
};

export const StepEditor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StepEditorComp);
