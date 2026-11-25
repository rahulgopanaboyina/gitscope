import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repositories: [],
  totalCount: 0,
  currentPage: 1,
  selectedPeriod: "7",
  searchTerm: "",
  loading: false,
  error: null,
  hasMore: true,
};

const repositorySlice = createSlice({
  name: "repositories",

  initialState,

  reducers: {
    fetchRepositoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },

    loadMoreRepositoriesRequest(state, action) {
      const { period, page } = action.payload;

      if (
        state.loading ||
        !state.hasMore ||
        period !== state.selectedPeriod ||
        page !== state.currentPage + 1 ||
        page > 50
      ) {
        return;
      }

      state.loading = true;
      state.error = null;
    },

    fetchRepositoriesSuccess(state, action) {
      const { repositories, totalCount, page, period } = action.payload;

      if (period !== state.selectedPeriod) {
        return;
      }

      if (page === 1) {
        state.repositories = repositories;
      } else {
        if (page !== state.currentPage + 1 || page > 50) {
          return;
        }

        const existingIds = new Set(
          state.repositories.map((repository) => repository.id),
        );

        const newRepositories = repositories.filter((repository) => {
          if (existingIds.has(repository.id)) {
            return false;
          }

          existingIds.add(repository.id);
          return true;
        });

        state.repositories.push(...newRepositories);
      }

      state.totalCount = totalCount;
      state.currentPage = page;
      state.loading = false;

      state.hasMore = page < 50 && repositories.length === 20;
    },

    fetchRepositoriesFailure(state, action) {
      const { message, period } = action.payload;

      if (period !== state.selectedPeriod) {
        return;
      }

      state.loading = false;
      state.error = message;
    },

    setSelectedPeriod(state, action) {
      state.selectedPeriod = action.payload;
      state.repositories = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },

    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  fetchRepositoriesRequest,
  loadMoreRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setSelectedPeriod,
  setSearchTerm,
} = repositorySlice.actions;

export default repositorySlice.reducer;
