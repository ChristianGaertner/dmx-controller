import * as React from 'react';
import {Device} from "./Device";
import {StepValue} from "./StepValue";
import {StepHeader} from "./StepHeader";
import {Scene} from "../types";

type Props = {}

const devices = [
    {name: 'Par01', id: 'devA'},
    {name: 'Par02', id: 'devB'},
    {name: 'Par03', id: 'devC'},
];

export const SceneEditor: React.FunctionComponent<Props> = props => {

    const [scene, setScene] = React.useState<Scene | null>(null);

    React.useEffect(() => {

        fetch('http://localhost:8080/api/v1/resources/scene/sc001')
            .then(r => r.json())
            .then(r => setScene(r))
    }, []);

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