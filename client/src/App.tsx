import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Editor } from "./editor/Editor";
import { SceneRunner } from "./live/SceneRunner";

const App: React.FunctionComponent = () => {
  const [page, setPage] = React.useState<"live" | "editor">("editor");

  return (
    <div className="flex flex-row">
      <Sidebar page={page} setPage={setPage} />
      {page === "live" && <SceneRunner />}
      {page === "editor" && <Editor />}
    </div>
  );
};

export default App;
