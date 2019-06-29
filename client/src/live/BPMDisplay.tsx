import * as React from "react";
import cx from "classnames";
import { useActions } from "../store/util";
import { sendBPM } from "../store/websocket/messages";
import { useSelector } from "react-redux";
import { getBPM } from "../store/selectors";

import { flash } from "./bpm_flash.module.css";

export const BPMDisplay: React.FunctionComponent = () => {
  const actions = useActions({
    sendBPM,
  });

  const bpm = useSelector(getBPM);

  const [taps, setTaps] = React.useState<number[]>([]);

  const onClick = React.useCallback(() => {
    setTaps([...taps, Date.now()]);
  }, [taps, setTaps]);

  React.useEffect(() => {
    if (taps.length !== 4) {
      return;
    }

    // reset
    setTaps([]);

    const [initial, ...timings] = taps;

    const diffs = timings.map(t => t - initial);

    const sum = diffs.reduce((a, b) => a + b, 0);

    const avgDiff = sum / diffs.length;

    const bpm = (60 * 1000) / avgDiff;

    actions.sendBPM(parseFloat(bpm.toFixed(1)));
  }, [actions, taps, setTaps]);

  const [highlight, setHighlight] = React.useState(0);

  const beatDuration = (60 * 1000) / bpm;

  React.useEffect(() => {
    const id = setInterval(() => {
      setHighlight((highlight + 1) % 4);
    }, beatDuration);

    return () => clearInterval(id);
  }, [highlight, setHighlight, beatDuration]);

  return (
    <button
      className="block relative rounded bg-gray-800 w-16 h-10 overflow-hidden"
      onClick={onClick}
    >
      <div className="w-full h-full flex flex-wrap">
        <div
          style={{ animationDuration: beatDuration * 2.5 + "ms" }}
          className={cx("w-1/2", {
            [flash]: highlight === 0,
          })}
        />
        <div
          style={{ animationDuration: beatDuration * 2.5 + "ms" }}
          className={cx("w-1/2", {
            [flash]: highlight === 1,
          })}
        />
        <div
          style={{ animationDuration: beatDuration * 2.5 + "ms" }}
          className={cx("w-1/2", {
            [flash]: highlight === 3,
          })}
        />
        <div
          style={{ animationDuration: beatDuration * 2.5 + "ms" }}
          className={cx("w-1/2", {
            [flash]: highlight === 2,
          })}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {bpm.toFixed(0)}
      </div>
    </button>
  );
};
