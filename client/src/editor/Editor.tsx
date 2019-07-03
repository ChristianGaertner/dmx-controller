import * as React from "react";
import { SceneSelector } from "./SceneSelector";
import { SceneEditor } from "./SceneEditor";
import { DefaultTimings } from "./DefaultTimings";
import { SaveButton } from "./SaveButton";
import { FixtureValueEditor } from "./fixturevalue/FixtureValueEditor";
import { StepEditor } from "./StepEditor";
import { ResetButton } from "./ResetButton";
import { EffectEditor } from "./effect/EffectEditor";

type Props = {};

const EditorComp: React.FunctionComponent<Props> = () => {
  return (
    <div className="flex flex-row">
      <SceneSelector />
      <div className="flex flex-col h-full overflow-auto p-4">
        <div className="flex">
          <DefaultTimings />
          <ResetButton />
          <SaveButton />
        </div>
        <SceneEditor />
        <FixtureValueEditor />
        <StepEditor />
        <EffectEditor />
      </div>
    </div>
  );
};

export const Editor = EditorComp;
