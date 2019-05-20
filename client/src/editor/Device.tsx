import * as React from 'react';

type Props = {
    device: { name: string, id: string };
}

export const Device: React.FunctionComponent<Props> = ({device}) => (
    <div className="p-4">
        <span className="uppercase tracking-wider">{ device.name }</span>
    </div>
);