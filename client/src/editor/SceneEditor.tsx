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

type StateProps = {
  sceneID: string | null;
  scene?: Scene;
};

type DispatchProps = {
  loadScene: (sceneID: string) => void;
};

type Props = StateProps & DispatchProps;

const devices = [{ name: "Par01", id: "devA" }, { name: "Par02", id: "devB" }];

const SceneEditorComp: React.FunctionComponent<Props> = ({
  sceneID,
  scene,
  loadScene
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
      <table className="table-fixed">
        <thead>
          <tr>
            <th>Devices</th>
            {steps.map((step, i) => (
              <th key={i}>
                <StepHeader index={i} timings={step.timings} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id} className="bg-gray-1000">
              <td>
                <Device device={device} />
              </td>

              {steps.map((step, i) => (
                <td key={i}>
                  {step.values[device.id] && (
                    <StepValue
                      value={step.values[device.id]}
                      effects={(step.effects || []).filter(fx =>
                        fx.devices.includes(device.id)
                      )}
                    />
                  )}
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
  loadScene: loadScene
};

export const SceneEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneEditorComp);
