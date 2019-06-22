import * as React from "react";
import cx from "classnames";

type Props = {
  defined: boolean;
  onDeactivate: () => void;
  className?: string;
};

export const DefinedIndicator: React.FunctionComponent<Props> = ({
  defined,
  onDeactivate,
  className,
}) => {
  return (
    <button
      onClick={onDeactivate}
      className={cx(
        "group rounded-full bg-blue-400 flex justify-center items-center transition",
        className,
        {
          "w-0 h-0": !defined,
          "w-3 h-3": defined,
        },
      )}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-2 w-2 fill-current text-blue-800 scale-0 group-hover:scale-1 transition-quick"
      >
        <polygon points="10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644" />
      </svg>
    </button>
  );
};
