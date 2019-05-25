import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Editor } from "./editor/Editor";
import { SceneRunner } from "./live/SceneRunner";
import { connect } from "react-redux";
import { loadDevices } from "./store/actions/loadDevices";
import { setTab, UiTab } from "./store/actions/setTab";
import { AppState } from "./store";
import { getActiveTab } from "./store/selectors";
import { wsConnect } from "./store/websocket/actions";

type StateProps = {
  tab: UiTab;
};

type DispatchProps = {
  loadDevices: () => void;
  setTab: (tab: UiTab) => void;
  wsConnect: () => void;
};

type Props = StateProps & DispatchProps;

const App: React.FunctionComponent<Props> = ({
  tab,
  setTab,
  loadDevices,
  wsConnect,
}) => {
  React.useEffect(() => {
    loadDevices();
    wsConnect();
  }, [loadDevices, wsConnect]);

  return (
    <div className="flex flex-row">
      <Sidebar tab={tab} setTab={setTab} />
      {tab === UiTab.LIVE && <SceneRunner />}
      {tab === UiTab.PROGRAM && <Editor />}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  tab: getActiveTab(state),
});

const mapDispatchToProps: DispatchProps = {
  loadDevices: loadDevices,
  setTab: setTab,
  wsConnect: wsConnect,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
