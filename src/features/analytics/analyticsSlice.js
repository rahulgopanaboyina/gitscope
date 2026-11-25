import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codeFrequency: [],
  commitActivity: [],
  contributors: [],

  selectedMetric: "commits",

  loading: false,
  codeFrequencyLoading: false,
  commitActivityLoading: false,
  contributorsLoading: false,

  error: null,
  codeFrequencyError: null,
  commitActivityError: null,
  contributorsError: null,

  codeFrequencyUnavailable: false,
  commitActivityUnavailable: false,
  contributorsUnavailable: false,
};

const analyticsSlice = createSlice({
  name: "analytics",

  initialState,

  reducers: {
    fetchAnalyticsRequest(state) {
      state.loading = true;
      state.error = null;

      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];

      state.codeFrequencyLoading = true;
      state.commitActivityLoading = true;
      state.contributorsLoading = true;

      state.codeFrequencyError = null;
      state.commitActivityError = null;
      state.contributorsError = null;

      state.codeFrequencyUnavailable = false;
      state.commitActivityUnavailable = false;
      state.contributorsUnavailable = false;
    },

    fetchCodeFrequencySuccess(state, action) {
      state.codeFrequency = action.payload || [];
      state.codeFrequencyLoading = false;
      state.codeFrequencyUnavailable = action.payload === null;
    },

    fetchCommitActivitySuccess(state, action) {
      state.commitActivity = action.payload || [];
      state.commitActivityLoading = false;
      state.commitActivityUnavailable = action.payload === null;
    },

    fetchContributorsSuccess(state, action) {
      state.contributors = action.payload || [];
      state.contributorsLoading = false;
      state.contributorsUnavailable = action.payload === null;
    },

    fetchCodeFrequencyFailure(state, action) {
      state.codeFrequencyLoading = false;
      state.codeFrequencyError = action.payload;
    },

    fetchCommitActivityFailure(state, action) {
      state.commitActivityLoading = false;
      state.commitActivityError = action.payload;
    },

    fetchContributorsFailure(state, action) {
      state.contributorsLoading = false;
      state.contributorsError = action.payload;
    },

    fetchAnalyticsComplete(state) {
      state.loading = false;
    },

    fetchAnalyticsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;

      state.codeFrequencyLoading = false;
      state.commitActivityLoading = false;
      state.contributorsLoading = false;
    },

    setSelectedMetric(state, action) {
      state.selectedMetric = action.payload;
    },

    resetAnalytics(state) {
      state.selectedMetric = "commits";
    },
  },
});

export const {
  fetchAnalyticsRequest,
  fetchCodeFrequencySuccess,
  fetchCommitActivitySuccess,
  fetchContributorsSuccess,
  fetchCodeFrequencyFailure,
  fetchCommitActivityFailure,
  fetchContributorsFailure,
  fetchAnalyticsComplete,
  fetchAnalyticsFailure,
  setSelectedMetric,
  resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
