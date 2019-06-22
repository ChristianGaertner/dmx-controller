import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Editor } from "./editor/Editor";
import { SceneRunner } from "./live/SceneRunner";
import { connect } from "react-redux";
import { setTab, UiTab } from "./store/actions/setTab";
import { AppState } from "./store";
import { getActiveTab } from "./store/selectors";
import { wsConnect } from "./store/websocket/actions";
import { PatchView } from "./patch/PatchView";

type StateProps = {
  tab: UiTab;
};

type DispatchProps = {
  setTab: (tab: UiTab) => void;
  wsConnect: () => void;
};

type Props = StateProps & DispatchProps;

const App: React.FunctionComponent<Props> = ({ tab, setTab, wsConnect }) => {
  React.useEffect(() => {
    wsConnect();
  }, [wsConnect]);

  return (
    <div className="flex flex-row">
      <Sidebar tab={tab} setTab={setTab} />
      {tab === UiTab.LIVE && <SceneRunner />}
      {tab === UiTab.PROGRAM && <Editor />}
      {tab === UiTab.PATCH && <PatchView />}
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  tab: getActiveTab(state),
});

const mapDispatchToProps: DispatchProps = {
  setTab: setTab,
  wsConnect: wsConnect,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
