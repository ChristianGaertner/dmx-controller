import * as React from "react";
import cx from "classnames";
import { Button, ButtonType } from "./Button";

type Props = {
  title: string;
};

export const Dialog: React.FunctionComponent<Props> = ({ title, children }) => (
  <DialogSurface className="w-2/3 h-64">
    <div className="px-4 py-2 text-xl font-medium tracking-wide">{title}</div>

    <div>{children}</div>

    <div className="bg-gray-1000 mt-auto rounded-b-xl px-4 py-2 flex justify-end">
      <Button label="CANCEL" type={ButtonType.RED} />
      <Button label="SAVE" type={ButtonType.GREEN} />
    </div>
  </DialogSurface>
);

export const DialogSurface: React.FunctionComponent<{ className?: string }> = ({
  children,
  className
}) => (
  <>
    <div className="fixed inset-0 bg-black opacity-25" />
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
