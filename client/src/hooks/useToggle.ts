import { useCallback, useState } from "react";

export default function useToggle(initalState = false): [boolean, () => void] {
  const [active, setActive] = useState(initalState);

  const toggle = useCallback(() => {
    setActive(!active);
  }, [active, setActive]);

  return [active, toggle];
}
