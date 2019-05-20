import * as React from 'react';
import {Device} from "./Device";
import {StepValue} from "./StepValue";
import {StepHeader} from "./StepHeader";
import {Scene} from "../types";
import {connect} from "react-redux";
import {AppState} from "../store";
import {getScene} from "../store/selectors";
import {loadScene} from "../store/actions/loadScene";

type StateProps = {
    scene?: Scene;
}

type DispatchProps = {
    loadScene: () => void;
}

type Props = StateProps & DispatchProps;

const devices = [
    {name: 'Par01', id: 'devA'},
    {name: 'Par02', id: 'devB'},
    {name: 'Par03', id: 'devC'},
];

const SceneEditorComp: React.FunctionComponent<Props> = ({scene, loadScene}) => {
    React.useEffect(() => {
        loadScene();
    }, [loadScene]);


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
                            <StepHeader index={i} timings={step.timings}/>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {devices.map(device => (
                    <tr key={device.id} className="bg-gray-1000">
                        <td>
                            <Device device={device}/>
                        </td>

                        {steps.map((step, i) => (
                            <td key={i}>
                                {step.values[device.id] && (
                                    <StepValue
                                        value={step.values[device.id]}
                                        effects={(step.effects || []).filter(fx => fx.devices.includes(device.id))}
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
    scene: getScene(state, {id: 'sc001'}),
});

const mapDispatchToProps: DispatchProps = {
    loadScene: () => loadScene('sc001'),
};

export const SceneEditor = connect(mapStateToProps, mapDispatchToProps)(SceneEditorComp);