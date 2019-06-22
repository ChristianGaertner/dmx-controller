import * as React from "react";
import { DefinedIndicator } from "./DefinedIndicator";

type Props = {
  defined: boolean;
  onDeactivate: () => void;

  label: string;
};

export const ControlSurface: React.FunctionComponent<Props> = props => (
  <div className="rounded p-2">
    <div className="flex items-center">
      <DefinedIndicator
        className="mr-1"
        defined={props.defined}
        onDeactivate={props.onDeactivate}
      />
      <span>{props.label}</span>
    </div>
    {props.children}
  </div>
);
