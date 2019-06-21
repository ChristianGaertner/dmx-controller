import * as React from "react";
import cx from "classnames";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const RESOLUTION = 1000;

export const Slider: React.FunctionComponent<Props> = props => {
  const value = props.value * RESOLUTION;
  const rawOnChange = props.onChange;
  const onChange = React.useCallback(
    v => {
      rawOnChange(parseFloat((v / RESOLUTION).toFixed(2)));
    },
    [rawOnChange],
  );

  const [dragging, setDragging] = React.useState(false);

  const buttonRef = React.useRef<HTMLDivElement | null>(null);

  const start = React.useRef<number | undefined>(undefined);
  const startValue = React.useRef<number | undefined>(undefined);

  const onDrag = React.useCallback(
    (e: MouseEvent) => {
      if (buttonRef.current === null || !dragging) {
        return;
      }
      if (start.current === undefined) {
        start.current = e.clientX;
      }

      const diff =
        (RESOLUTION * (e.clientX - start.current)) /
        buttonRef.current.clientWidth;

      const next = (startValue.current || 0) + diff;
      onChange(Math.min(RESOLUTION, Math.max(0, next)));
    },
    [onChange, start, startValue, buttonRef, dragging],
  );

  const onDragStart = React.useCallback(() => {
    start.current = undefined;
    startValue.current = value;

    setDragging(true);
  }, [setDragging, start, startValue, value]);

  const onDragStop = React.useCallback(() => {
    setDragging(false);
    start.current = undefined;

    window.removeEventListener("mousemove", onDrag);
  }, [setDragging, start, onDrag]);

  React.useEffect(() => {
    window.addEventListener("mouseup", onDragStop);
    window.addEventListener("mousemove", onDrag);
    return () => {
      window.removeEventListener("mouseup", onDragStop);
      window.removeEventListener("mousemove", onDrag);
    };
  }, [onDragStop, onDrag]);

  return (
    <div
      ref={buttonRef}
      className="relative w-48 h-full p-2 bg-gray-1000 rounded select-none cursor-pointer"
      onMouseDown={onDragStart}
    >
      {Array.from(new Array(9).keys()).map(tick => (
        <span
          key={tick}
          className="absolute top-0 h-2 bg-white z-20 opacity-25"
          style={{ left: `calc(${(tick + 1) * 10}% - 0.5px)`, width: "1px" }}
        />
      ))}

      <div
        style={{ width: `${(props.value * 100).toFixed(0)}%` }}
        className={cx("absolute inset-0 rounded", {
          "bg-gray-700": dragging,
          "bg-gray-800": !dragging,
        })}
      />

      <div className="absolute inset-0 flex z-10 justify-center items-center">
        {(props.value * 100).toFixed(0)}%
      </div>

      <div className="invisible">Stretch</div>
    </div>
  );
};
