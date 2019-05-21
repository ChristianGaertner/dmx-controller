import * as React from "react";
import { SceneSelector } from "./SceneSelector";
import { SceneEditor } from "./SceneEditor";
import { DefaultTimings } from "./DefaultTimings";

type Props = {};

const EditorComp: React.FunctionComponent<Props> = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex">
        <SceneSelector />
        <DefaultTimings />
      </div>
      <SceneEditor />
    </div>
  );
};

export const Editor = EditorComp;
