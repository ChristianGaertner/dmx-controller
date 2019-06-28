import * as React from "react";
import cx from "classnames";
import { useSelector } from "react-redux";
import {
  getStepForEditing,
  isStepPreviewing,
} from "../../store/editor/selectors";
import { AppState } from "../../store";
import { useActions } from "../../store/util";
import { requestStepPreview } from "../../store/websocket/messages";
import { previewStep, unpreviewStep } from "../../store/editor/actions";
import { stopScene } from "../../store/actions/runScene";

export const PreviewButton: React.FunctionComponent<{ stepId: string }> = ({
  stepId,
}) => {
  const { step, isPreviewing } = useSelector((state: AppState) => ({
    step: getStepForEditing(state, stepId),
    isPreviewing: isStepPreviewing(state, stepId),
  }));

  const actions = useActions({
    requestStepPreview,
    previewStep,
    unpreviewStep,
    stopScene,
  });

  React.useEffect(() => {
    if (!step || !isPreviewing) {
      return;
    }
    actions.requestStepPreview(step);
  }, [step, isPreviewing, actions]);

  const onClick = React.useCallback(() => {
    if (isPreviewing) {
      actions.stopScene("PREVIEW/" + stepId);
      actions.unpreviewStep();
    } else {
      actions.previewStep(stepId);
    }
  }, [actions, isPreviewing, stepId]);

  return (
    <button
      className={cx("px-2 flex justify-center items-center rounded", {
        "bg-green-500 hover:bg-red-900": isPreviewing,
        "hover:bg-gray-800": !isPreviewing,
      })}
      onClick={onClick}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
        <g stroke="none" strokeWidth="1" fillRule="evenodd">
          <path d="M19.8005808,10 C17.9798698,6.43832409 14.2746855,4 10,4 C5.72531453,4 2.02013017,6.43832409 0.199419187,10 C2.02013017,13.5616759 5.72531453,16 10,16 C14.2746855,16 17.9798698,13.5616759 19.8005808,10 Z M10,14 C12.209139,14 14,12.209139 14,10 C14,7.790861 12.209139,6 10,6 C7.790861,6 6,7.790861 6,10 C6,12.209139 7.790861,14 10,14 Z M10,12 C11.1045695,12 12,11.1045695 12,10 C12,8.8954305 11.1045695,8 10,8 C8.8954305,8 8,8.8954305 8,10 C8,11.1045695 8.8954305,12 10,12 Z" />
        </g>
      </svg>
    </button>
  );
};
