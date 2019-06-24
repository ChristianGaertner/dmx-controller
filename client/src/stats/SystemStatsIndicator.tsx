import * as React from "react";
import { useSelector } from "react-redux";
import { getSystemStats } from "../store/websocket/selectors";

export const SystemStatsIndicator: React.FunctionComponent = () => {
  const stats = useSelector(getSystemStats);

  if (stats.heapSys === 0) {
    return null;
  }

  const load = stats.heapSys > 0 ? stats.heapAlloc / stats.heapSys : 0;

  return (
    <div className="flex flex-col px-2 text-sm text-gray-600">
      {stats.heapSys > 0 && (
        <span>
          Mem: {(stats.heapAlloc / 1e6).toFixed(0)}/
          {(stats.heapSys / 1e6).toFixed(0)}MB
        </span>
      )}
      {load > 0.5 && (
        <span className="text-red-500 tracking-widest">
          HIGH LOAD {(load * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
};
