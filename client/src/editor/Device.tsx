import * as React from "react";
import { useSelector } from "react-redux";
import { getDeviceName } from "../store/selectors";
import { AppState } from "../store";

type Props = {
  id: string;
};

export const Device: React.FunctionComponent<Props> = ({ id }) => {
  const name = useSelector((s: AppState) => getDeviceName(s, id));

  return (
    <div className="p-4">
      <span className="uppercase tracking-wider">{name || id}</span>
    </div>
  );
};
