import * as React from "react";
import { Input } from "./Input";

type Props = {
  display?: React.ReactElement | string;
  value: string;
  onSave: (value: string) => void;
};

export const InlineInputField: React.FunctionComponent<Props> = props => {
  const [editMode, setEditMode] = React.useState(false);
  const [value, setValue] = React.useState(props.value);

  const propValue = props.value;
  React.useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  if (!editMode) {
    return (
      <button onClick={() => setEditMode(true)}>
        {props.display || props.value}
      </button>
    );
  }

  return (
    <div className="flex flex-row text-white">
      <Input value={value} setValue={setValue} className="rounded-l" />
      <button
        className="bg-red-600 p-2 hover:bg-red-500"
        onClick={() => {
          setValue(propValue);
          setEditMode(false);
        }}
      >
        <svg viewBox="0 0 20 20" className="fill-current text-red-200 h-3 w-3">
          <g stroke="none" strokeWidth="1" fillRule="evenodd">
            <g>
              <polygon points="10 8.58578644 2.92893219 1.51471863 1.51471863 2.92893219 8.58578644 10 1.51471863 17.0710678 2.92893219 18.4852814 10 11.4142136 17.0710678 18.4852814 18.4852814 17.0710678 11.4142136 10 18.4852814 2.92893219 17.0710678 1.51471863 10 8.58578644" />
            </g>
          </g>
        </svg>
      </button>
      <button
        className="bg-green-500 p-2 rounded-r hover:bg-green-400"
        onClick={() => {
          props.onSave(value);
          setEditMode(false);
        }}
      >
        <svg
          viewBox="0 0 20 20"
          className="fill-current text-green-200 h-3 w-3"
        >
          <g stroke="none" strokeWidth="1" fillRule="evenodd">
            <g>
              <polygon points="0 11 2 9 7 14 18 3 20 5 7 18" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
};
