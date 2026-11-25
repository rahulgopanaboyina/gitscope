import { all, call, put, takeLatest } from "redux-saga/effects";

import {
  fetchCodeFrequency,
  fetchCommitActivity,
  fetchContributors,
} from "../../services/githubApi";

import {
  fetchAnalyticsRequest,
  fetchCodeFrequencySuccess,
  fetchCommitActivitySuccess,
  fetchContributorsSuccess,
  fetchCodeFrequencyFailure,
  fetchCommitActivityFailure,
  fetchContributorsFailure,
  fetchAnalyticsComplete,
} from "./analyticsSlice";

// Fetch one analytics resource independently
function* fetchAnalyticsResource(
  apiFunction,
  successAction,
  failureAction,
  owner,
  repo,
) {
  try {
    const data = yield call(apiFunction, owner, repo);
    yield put(successAction(data));
  } catch (error) {
    yield put(failureAction(error.message));
  }
}

// Handle analytics API requests
function* handleFetchAnalytics(action) {
  const { owner, repo } = action.payload;

  yield all([
    call(
      fetchAnalyticsResource,
      fetchCodeFrequency,
      fetchCodeFrequencySuccess,
      fetchCodeFrequencyFailure,
      owner,
      repo,
    ),

    call(
      fetchAnalyticsResource,
      fetchCommitActivity,
      fetchCommitActivitySuccess,
      fetchCommitActivityFailure,
      owner,
      repo,
    ),

    call(
      fetchAnalyticsResource,
      fetchContributors,
      fetchContributorsSuccess,
      fetchContributorsFailure,
      owner,
      repo,
    ),
  ]);

  yield put(fetchAnalyticsComplete());
}

// Watch for analytics requests
function* watchAnalytics() {
  yield takeLatest(fetchAnalyticsRequest.type, handleFetchAnalytics);
}

export default watchAnalytics;
