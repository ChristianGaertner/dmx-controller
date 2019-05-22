import * as React from "react";
import cx from "classnames";

export enum ButtonType {
  GREEN,
  RED,
  BLUE,
  ORANGE,
}

type Props = {
  label: string;
  onClick?: () => void;
  type: ButtonType;
};

export const Button: React.FunctionComponent<Props> = ({
  label,
  onClick,
  type,
}) => (
  <button
    className={cx("rounded border-2 mx-2 my-1 px-4 py-2 tracking-wide", {
      "bg-green-1000 border-green-800 hover:bg-green-900":
        type === ButtonType.GREEN,
      "bg-red-1000 border-red-800 hover:bg-red-900": type === ButtonType.RED,
      "bg-orange-1000 border-orange-800 hover:bg-orange-900":
        type === ButtonType.ORANGE,
      "bg-blue-1000 border-blue-800 hover:bg-blue-900":
        type === ButtonType.BLUE,
      "opacity-75 cursor-not-allowed": !onClick,
    })}
    onClick={onClick}
    disabled={!onClick}
  >
    {label}
  </button>
);
