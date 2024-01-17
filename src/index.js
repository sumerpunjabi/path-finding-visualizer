import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers';

const app = configureStore({
  reducer: reducers,
});

ReactDOM.render(
  <Provider store={app}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
