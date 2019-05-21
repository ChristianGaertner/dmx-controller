import * as React from "react";
import { SceneSelector } from "./SceneSelector";
import { SceneEditor } from "./SceneEditor";
import { connect } from "react-redux";
import { Timings } from "../types";
import { AppState } from "../store";
import { getSceneForEditing } from "../store/editor/selectors";
import { DefaultTimings } from "./DefaultTimings";

type StateProps = {
  defaultTimings?: Timings;
};

const EditorComp: React.FunctionComponent<StateProps> = ({
  defaultTimings
}) => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex">
        <SceneSelector />
        {!!defaultTimings && <DefaultTimings timings={defaultTimings} />}
      </div>
      <SceneEditor />
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  defaultTimings: (() => {
    const scene = getSceneForEditing(state);
    return scene && scene.defaultTimings;
  })()
});

export const Editor = connect(mapStateToProps)(EditorComp);
