import * as React from "react";

type Props = {
  name: string;
  onChange: (name: string) => void;
};

export const SceneRenameButton: React.FunctionComponent<Props> = props => {
  const onClick = React.useCallback(() => {
    const res = prompt("New Name", props.name);

    if (!!res) {
      props.onChange(res);
    }
  }, [props]);

  return (
    <button
      className="mx-2 p-2 hover:bg-gray-900 active:bg-gray-800 rounded-full h-8 w-8 flex justify-center"
      onClick={onClick}
    >
      <svg viewBox="0 0 20 20" className="fill-current text-blue-700 h-3 w-3">
        <path d="M12.2928932,3.70710678 L0,16 L0,20 L4,20 L16.2928932,7.70710678 L12.2928932,3.70710678 Z M13.7071068,2.29289322 L16,0 L20,4 L17.7071068,6.29289322 L13.7071068,2.29289322 Z" />
      </svg>
    </button>
  );
};
