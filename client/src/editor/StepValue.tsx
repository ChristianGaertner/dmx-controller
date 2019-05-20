import * as React from 'react';
import {Effect, FixtureValue} from "../types";

type Props = {
    value: FixtureValue;
    effects: Effect[];
}

export const StepValue: React.FunctionComponent<Props> = ({value, effects}) => (
    <div className="mx-2 p-2">
        <div>
            <div className="bg-teal-900 p-2 flex flex-col">
                {Object.entries(value).map(([type, val]) => !!val && (
                    <span>{type}</span>
                ))}
            </div>
            {effects.map(fx => (
                <div className="bg-red-900">
                    {fx.type}
                </div>
            ))}
        </div>
    </div>
);