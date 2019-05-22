import * as React from "react";
import { Device } from "./Device";
import { StepValue } from "./StepValue";
import { StepHeader } from "./StepHeader";
import { Scene } from "../types";
import { connect } from "react-redux";
import { AppState } from "../store";
import { loadScene } from "../store/actions/loadScene";
import {
  getSceneForEditing,
  getSelectedSceneId
} from "../store/editor/selectors";
import { addStep } from "../store/editor/actions";

type StateProps = {
  sceneID: string | null;
  scene: Scene | null;
};

type DispatchProps = {
  loadScene: (sceneID: string) => void;
  addStep: () => void;
};

type Props = StateProps & DispatchProps;

const devices = [{ name: "Par01", id: "devA" }, { name: "Par02", id: "devB" }];

const SceneEditorComp: React.FunctionComponent<Props> = ({
  sceneID,
  scene,
  loadScene,
  addStep
}) => {
  React.useEffect(() => {
    if (sceneID) {
      loadScene(sceneID);
    }
  }, [sceneID, loadScene]);

  if (!sceneID) {
    return null;
  }

  if (!scene) {
    return <h1>Loading...</h1>;
  }

  const steps = scene.steps;

  return (
    <div className="p-8 flex w-full">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th>Devices</th>
            {steps.map((step, i) => (
              <th key={step.id}>
                <StepHeader
                  id={step.id}
                  index={i}
                  timings={step.timings}
                  defaultTimings={scene.defaultTimings}
                />
              </th>
            ))}
            <th>
              <button
                onClick={addStep}
                className="px-6 py-2 mx-auto flex flex-row justify-center items-center tracking-wide rounded hover:bg-gray-900"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current mr-2">
                  <g stroke="none" strokeWidth="1" fillRule="evenodd">
                    <g>
                      <path d="M11,9 L11,5 L9,5 L9,9 L5,9 L5,11 L9,11 L9,15 L11,15 L11,11 L15,11 L15,9 L11,9 Z M10,20 C15.5228475,20 20,15.5228475 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,15.5228475 4.4771525,20 10,20 Z M10,18 C14.418278,18 18,14.418278 18,10 C18,5.581722 14.418278,2 10,2 C5.581722,2 2,5.581722 2,10 C2,14.418278 5.581722,18 10,18 Z" />
                    </g>
                  </g>
                </svg>
                <span>ADD</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id} className="bg-gray-1000">
              <td>
                <Device device={device} />
              </td>

              {steps.map((step, i) => (
                <td
                  key={i}
                  style={{ width: `${100 / steps.length}%` }}
                  className="align-top"
                >
                  {
                    <StepValue
                      stepId={step.id}
                      deviceId={device.id}
                      value={step.values[device.id]}
                      effects={(step.effects || []).filter(fx =>
                        fx.devices.includes(device.id)
                      )}
                    />
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  sceneID: getSelectedSceneId(state),
  scene: getSceneForEditing(state)
});

const mapDispatchToProps: DispatchProps = {
  loadScene: loadScene,
  addStep: addStep
};

export const SceneEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneEditorComp);
