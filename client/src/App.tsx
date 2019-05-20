import * as React from 'react';
import {Sidebar} from "./Sidebar";
import {SceneEditor} from "./editor/SceneEditor";

const App: React.FunctionComponent = () => {
    return (
        <div className="flex flex-row">
            <Sidebar/>
            <SceneEditor/>
        </div>
    );
};

export default App;
