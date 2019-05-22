import * as React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export const Select: React.FunctionComponent<Props> = ({
  value,
  onChange,
  children,
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className="block appearance-none bg-gray-900 hover:bg-gray-800 cursor-pointer border border-gray-800 text-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
  >
    {children}
  </select>
);
