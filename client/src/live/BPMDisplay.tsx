import * as React from "react";
import { useActions } from "../store/util";
import { sendBPM } from "../store/websocket/messages";
import { Button, ButtonType } from "../components/Button";

export const BPMDisplay: React.FunctionComponent = () => {
  const actions = useActions({
    sendBPM,
  });

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

  return (
    <Button
      type={ButtonType.GREEN}
      label={taps.length.toString()}
      onClick={onClick}
    />
  );
};
