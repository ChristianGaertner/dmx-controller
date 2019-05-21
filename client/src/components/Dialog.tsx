import * as React from "react";
import cx from "classnames";

type Props = {
  title: string;
  onRequestClose?: () => void;
};

export const Dialog: React.FunctionComponent<Props> = ({
  title,
  onRequestClose,
  children
}) => (
  <DialogSurface className="w-2/3 h-64">
    <div className="px-4 py-2 text-xl font-medium tracking-wide flex items-center justify-between">
      {title}
      {!!onRequestClose && <CloseButton onRequestClose={onRequestClose} />}
    </div>
    {children}
  </DialogSurface>
);

export const DialogSurface: React.FunctionComponent<{ className?: string }> = ({
  children,
  className
}) => (
  <>
    <div className="fixed inset-0 bg-black opacity-75" />
    <div
      className={cx(
        "fixed inset-0 m-auto z-50 bg-gray-900 border border-blue-1000 rounded-xl flex flex-col",
        className
      )}
    >
      {children}
    </div>
  </>
);

const CloseButton: React.FunctionComponent<{ onRequestClose: () => void }> = ({
  onRequestClose
}) => (
  <button
    onClick={onRequestClose}
    className="hover:bg-gray-800 p-2 rounded-full"
  >
    <svg viewBox="0 0 20 20" className="fill-current w-4 h-4">
      <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
        <g id="icon-shape">
          <polygon points="10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644" />
        </g>
      </g>
    </svg>
  </button>
);
