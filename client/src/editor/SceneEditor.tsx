import * as React from "react";
import cx from "classnames";
import { Device } from "./Device";
import { StepValue } from "./StepValue";
import { StepHeader } from "./StepHeader";
import { EffectType, Scene } from "../types";
import { connect } from "react-redux";
import { AppState } from "../store";
import { loadScene } from "../store/actions/loadScene";
import {
  getHighlightedEffectDevices,
  getSceneForEditing,
  getSelectedSceneId
} from "../store/editor/selectors";
import { addEffect, addStep } from "../store/editor/actions";
import { EffectValue } from "./EffectValue";
import { AddButton } from "./components/AddButton";

type StateProps = {
  sceneID: string | null;
  scene: Scene | null;
  highlightedEffectDevices: string[] | null;
};

type DispatchProps = {
  loadScene: (sceneID: string) => void;
  addStep: () => void;
  addEffect: (stepId: string, type: EffectType) => void;
};

type Props = StateProps & DispatchProps;

const devices = [{ name: "Par01", id: "devA" }, { name: "Par02", id: "devB" }];

const SceneEditorComp: React.FunctionComponent<Props> = ({
  sceneID,
  scene,
  loadScene,
  addStep,
  addEffect,
  highlightedEffectDevices
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
            <th className="align-top">Devices</th>
            {steps.map((step, i) => (
              <th key={step.id} className="align-top">
                <StepHeader
                  id={step.id}
                  index={i}
                  timings={step.timings}
                  defaultTimings={scene.defaultTimings}
                />
                <AddButton
                  onClick={() => addEffect(step.id, EffectType.DimmerSineType)}
                  label="ADD FX"
                />
                {step.effects &&
                  step.effects.map(fx => (
                    <EffectValue key={fx.id} effect={fx} />
                  ))}
              </th>
            ))}
            <th className="align-top">
              <AddButton onClick={addStep} label="ADD STEP" />
            </th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr
              key={device.id}
              className={cx("bg-gray-1000", {
                "bg-red-1000":
                  highlightedEffectDevices &&
                  highlightedEffectDevices.includes(device.id)
              })}
            >
              <td>
                <Device device={device} />
              </td>

              {steps.map((step, i) => (
                <td
                  key={i}
                  style={{ width: `${100 / steps.length}%` }}
                  className="align-top"
                >
                  <StepValue
                    stepId={step.id}
                    deviceId={device.id}
                    value={step.values[device.id]}
                  />
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
  scene: getSceneForEditing(state),
  highlightedEffectDevices: getHighlightedEffectDevices(state)
});

const mapDispatchToProps: DispatchProps = {
  loadScene: loadScene,
  addStep: addStep,
  addEffect: addEffect
};

export const SceneEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SceneEditorComp);
