import * as React from "react";
import { FixtureValue } from "../types";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Action } from "../store/actionTypes";
import { selectFixtureValue } from "../store/editor/actions";

type OwnProps = {
  value?: FixtureValue;

  stepId: string;
  deviceId: string;
};

type DispatchProps = {
  editFixtureValue: () => void;
};

type Props = OwnProps & DispatchProps;

const StepValueComp: React.FunctionComponent<Props> = ({
  value,
  editFixtureValue
}) => (
  <div className="mx-2 p-2 text-sm">
    <div>
      <button
        className="w-full bg-blue-1000 border-2 border-transparent hover:border-blue-900 rounded p-2 flex flex-row items-center cursor-pointer"
        onClick={editFixtureValue}
      >
        {!!value && (
          <>
            {!!value.color && (
              <span
                style={{
                  backgroundColor: `rgb(${value.color.R * 255},${value.color.G *
                    255},${value.color.B * 255})`
                }}
                className="block h-2 w-2 mr-2 rounded-full"
              />
            )}
            {value.dimmer !== undefined &&
              parseFloat(((value.dimmer || 0) * 100).toFixed(2)) + "%"}
          </>
        )}
        {!value && (
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <g stroke="none" strokeWidth="1" fillRule="evenodd">
              <g>
                <path d="M11,9 L11,5 L9,5 L9,9 L5,9 L5,11 L9,11 L9,15 L11,15 L11,11 L15,11 L15,9 L11,9 Z M10,20 C15.5228475,20 20,15.5228475 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,15.5228475 4.4771525,20 10,20 Z M10,18 C14.418278,18 18,14.418278 18,10 C18,5.581722 14.418278,2 10,2 C5.581722,2 2,5.581722 2,10 C2,14.418278 5.581722,18 10,18 Z" />
              </g>
            </g>
          </svg>
        )}
      </button>
    </div>
  </div>
);

const mapDispatchToProps = (
  dispatch: Dispatch<Action>,
  props: OwnProps
): DispatchProps => ({
  editFixtureValue: () =>
    dispatch(selectFixtureValue(props.stepId, props.deviceId))
});

export const StepValue = connect(
  undefined,
  mapDispatchToProps
)(StepValueComp);
