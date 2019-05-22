import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { configureStore } from "./store";

const store = configureStore();

const Index: React.FunctionComponent<{ NextApp: any }> = ({ NextApp }) => (
  <Provider store={store}>
    <NextApp />
  </Provider>
);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept("./App", () => {
    const nextApp = require("./App").default;
    ReactDOM.render(
      <Index NextApp={nextApp} />,
      document.getElementById("root"),
    );
  });
}

ReactDOM.render(<Index NextApp={App} />, document.getElementById("root"));
