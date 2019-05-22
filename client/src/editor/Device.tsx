import * as React from "react";

type Props = {
  id: string;
};

export const Device: React.FunctionComponent<Props> = ({ id }) => (
  <div className="p-4">
    <span className="uppercase tracking-wider">{id}</span>
  </div>
);
