import * as React from "react";
import cx from "classnames";

type Props = {
  value: string;
  setValue: (value: string) => void;

  disabled?: boolean;

  className?: string;
};

export const Input: React.FunctionComponent<Props> = ({
  value,
  setValue,
  disabled = false,
  className,
}) => {
  const [buffer, setBuffer] = React.useState(value);

  React.useEffect(() => {
    setBuffer(value);
  }, [value]);

  const onBlur = React.useCallback(() => {
    setValue(buffer);
  }, [setValue, buffer]);

  return (
    <input
      type="text"
      value={buffer}
      onChange={e => setBuffer(e.target.value)}
      onBlur={onBlur}
      disabled={disabled}
      className={cx(
        "appearance-none bg-gray-900 border border-blue-900 focus:bg-gray-1000 focus:outline-none px-2 w-24 text-center",
        className,
        {
          rounded: !className || className.indexOf("rounded") === -1,
        },
      )}
    />
  );
};
