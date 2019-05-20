import * as React from "react";
import { SceneSelector } from "./SceneSelector";
import { SceneEditor } from "./SceneEditor";

export const Editor: React.FunctionComponent<{}> = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex">
        <SceneSelector />
      </div>
      <SceneEditor />
    </div>
  );
};
