import { all, call, put, takeLatest, takeLeading } from "redux-saga/effects";

import { fetchRepositories } from "../../services/githubApi";

import {
  fetchRepositoriesRequest,
  loadMoreRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
} from "./repositorySlice";

// Handle repository API requests
function* handleFetchRepositories(action) {
  const { period, page = 1 } = action.payload;

  try {
    const result = yield call(fetchRepositories, {
      period,
      page,
      perPage: 20,
    });

    yield put(
      fetchRepositoriesSuccess({
        ...result,
        page,
        period,
      }),
    );
  } catch (error) {
    yield put(
      fetchRepositoriesFailure({
        message: error.message,
        period,
      }),
    );
  }
}

// Handle initial loading and period changes
function* watchInitialRepositories() {
  yield takeLatest(fetchRepositoriesRequest.type, handleFetchRepositories);
}

// Handle additional pagination requests
function* watchMoreRepositories() {
  yield takeLeading(loadMoreRepositoriesRequest.type, handleFetchRepositories);
}

export default function* watchRepositories() {
  yield all([watchInitialRepositories(), watchMoreRepositories()]);
}
