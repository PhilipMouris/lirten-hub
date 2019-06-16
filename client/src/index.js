import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Routes from "./routes";
import Scrolling from "./ScrollToTop.js";
import UserReducer from "./reducers/UserReducer.js";
import { createStore } from "redux";
import { Provider } from "react-redux";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function(registration) {
      console.log("Registra tion successful, scope is:", registration.scope);
    })
    .catch(function(err) {
      console.log("Service worker registration failed, error:", err);
    });
}
const store = createStore(UserReducer);
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Scrolling>
        <App>
          <Routes />
        </App>
      </Scrolling>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
serviceWorker.unregister();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
