import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Editor } from "./editor/Editor";
import { SceneRunner } from "./live/SceneRunner";
import { connect } from "react-redux";
import { loadDevices } from "./store/actions/loadDevices";

type Props = {
  loadDevices: () => void;
};

const App: React.FunctionComponent<Props> = ({ loadDevices }) => {
  const [page, setPage] = React.useState<"live" | "editor">("editor");

  React.useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  return (
    <div className="flex flex-row">
      <Sidebar page={page} setPage={setPage} />
      {page === "live" && <SceneRunner />}
      {page === "editor" && <Editor />}
    </div>
  );
};

const mapDispatchToProps = {
  loadDevices: loadDevices
};

export default connect(
  undefined,
  mapDispatchToProps
)(App);
