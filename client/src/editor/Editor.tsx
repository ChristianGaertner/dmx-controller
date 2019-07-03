import * as React from "react";
import { SceneEditor } from "./SceneEditor";
import { DefaultTimings } from "./DefaultTimings";
import { FixtureValueEditor } from "./fixturevalue/FixtureValueEditor";
import { StepEditor } from "./StepEditor";
import { EffectEditor } from "./effect/EffectEditor";
import { NoSelection } from "./NoSelection";
import { SceneSelector } from "./sceneselector/SceneSelector";
import { ActionBar } from "./ActionBar";
import { SceneName } from "./SceneName";

type Props = {};

const EditorComp: React.FunctionComponent<Props> = () => {
  return (
    <div className="flex flex-row">
      <SceneSelector />
      <div className="flex flex-col h-full overflow-auto p-4">
        <SceneName />
        <div className="flex flex-shrink-0">
          <DefaultTimings />
          <ActionBar />
        </div>
        <NoSelection />
        <SceneEditor />
        <FixtureValueEditor />
        <StepEditor />
        <EffectEditor />
      </div>
    </div>
  );
};

export const Editor = EditorComp;
