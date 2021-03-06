import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import promiseMiddleware from "./middleware/promise";
import rootReducer from "./reducers";
import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(rootReducer, {}, applyMiddleware(promiseMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App>
        <link rel="shortcut icon" href="./assets/favicon/favicon.ico" />
      </App>
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
