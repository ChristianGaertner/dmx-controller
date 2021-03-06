import * as React from "react";
import cx from "classnames";
import { Effect } from "../../types";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { onHighlightEffect, selectEffect } from "../../store/editor/actions";
import { getHighlightedEffectId } from "../../store/editor/selectors";

type OwnProps = {
  effect: Effect;
};

type StateProps = {
  isHighlighted: boolean;
};

type DispatchProps = {
  selectEffect: (effectId: string) => void;
  onHighlightEffect: (effectId: string | null) => void;
};

type Props = OwnProps & StateProps & DispatchProps;

const EffectValueComp: React.FunctionComponent<Props> = props => (
  <div className="px-4">
    <button
      className={cx(
        "w-full bg-red-1000 border-2 border-transparent rounded flex items-center p-1 my-2 cursor-pointer",
        {
          "border-red-900": props.isHighlighted,
        },
      )}
      onClick={() => props.selectEffect(props.effect.id)}
      onMouseEnter={() => props.onHighlightEffect(props.effect.id)}
      onMouseLeave={() => props.onHighlightEffect(null)}
    >
      <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current mr-2">
        <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
          <g id="icon-shape">
            <path d="M12,4 L16.2675644,4 C16.6133738,3.40219863 17.2597176,3 18,3 C19.1045695,3 20,3.8954305 20,5 C20,6.1045695 19.1045695,7 18,7 C17.2597176,7 16.6133738,6.59780137 16.2675644,6 L14.1272021,6 C16.8117063,7.38774438 18.7082951,10.0870366 18.9692039,13.2501122 C19.5839474,13.591326 20,14.2470758 20,15 C20,16.1045695 19.1045695,17 18,17 C16.8954305,17 16,16.1045695 16,15 C16,14.2745489 16.3862443,13.63931 16.9643071,13.2887091 C16.6761941,10.4337586 14.6725429,8.08526633 12,7.28987868 L12,8 L8,8 L8,7.28987868 C5.32745712,8.08526633 3.32380592,10.4337586 3.03569291,13.2887091 C3.6137557,13.63931 4,14.2745489 4,15 C4,16.1045695 3.1045695,17 2,17 C0.8954305,17 0,16.1045695 0,15 C0,14.2470758 0.416052621,13.591326 1.03079608,13.2501122 C1.29170491,10.0870366 3.1882937,7.38774438 5.87279794,6 L3.73243561,6 C3.38662619,6.59780137 2.74028236,7 2,7 C0.8954305,7 0,6.1045695 0,5 C0,3.8954305 0.8954305,3 2,3 C2.74028236,3 3.38662619,3.40219863 3.73243561,4 L8,4 L8,3 L12,3 L12,4 Z" />
          </g>
        </g>
      </svg>
      {getNameForType(props.effect.type)}
    </button>
  </div>
);

export const getNameForType = (type: string): string =>
  type.substring(0, type.length - 4);

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  isHighlighted: getHighlightedEffectId(state) === ownProps.effect.id,
});

const mapDispatchToProps: DispatchProps = {
  selectEffect: selectEffect,
  onHighlightEffect: onHighlightEffect,
};

export const EffectValue = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EffectValueComp);
