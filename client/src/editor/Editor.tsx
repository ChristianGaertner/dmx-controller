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
    <div className="flex flex-col p-4">
      <div className="flex">
        <SceneSelector />
        <DefaultTimings />
        <ResetButton />
        <SaveButton />
      </div>
      <SceneEditor />
      <FixtureValueEditor />
      <StepEditor />
      <EffectEditor />
    </div>
  );
};

export const Editor = EditorComp;
