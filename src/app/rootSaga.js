import { all, fork } from "redux-saga/effects";

import watchRepositories from "../features/repositories/repositorySaga";
import watchAnalytics from "../features/analytics/analyticsSaga";

function* rootSaga() {
  yield all([fork(watchRepositories), fork(watchAnalytics)]);
}

export default rootSaga;
