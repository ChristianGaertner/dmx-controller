import * as React from 'react';

export const SceneRunner: React.FunctionComponent = () => {

    const [scenes, setScenes] = React.useState([]);


    React.useEffect(() => {
        fetch('http://localhost:8080/api/v1/resources/scene')
            .then(r => r.json())
            .then(setScenes)
    }, []);

    const runScene = (id: string) => fetch(`http://localhost:8080/api/v1/run/scene/${id}`, {
        method: 'POST',
    });

    const stopScene = () => fetch(`http://localhost:8080/api/v1/stop/scene`, {
        method: 'POST',
    });


    return (
        <div className="flex flex-row">
            <button
                onClick={stopScene}
                className="bg-red-900"
            >
                STOP ALL
            </button>
            {scenes.map(id => (
                <button
                    key={id}
                    onClick={() => runScene(id)}
                    className="bg-green-900"
                >
                    RUN {id}
                </button>
            ))}
        </div>
    );
};
