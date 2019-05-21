import * as React from "react";
import { SceneSelector } from "./SceneSelector";
import { SceneEditor } from "./SceneEditor";
import { DefaultTimings } from "./DefaultTimings";
import { SaveButton } from "./SaveButton";

type Props = {};

const EditorComp: React.FunctionComponent<Props> = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex">
        <SceneSelector />
        <DefaultTimings />
        <SaveButton />
      </div>
      <SceneEditor />
    </div>
  );
};

export const Editor = EditorComp;
