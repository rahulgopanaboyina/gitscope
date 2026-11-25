import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./rootSaga";
import repositoryReducer from "../features/repositories/repositorySlice";
import analyticsReducer from "../features/analytics/analyticsSlice";

// Create the Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure the Redux store
const store = configureStore({
  reducer: {
    repositories: repositoryReducer,
    analytics: analyticsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

// Start the root Saga
sagaMiddleware.run(rootSaga);

export default store;
