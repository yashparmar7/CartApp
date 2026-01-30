import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductReviewsAPI, addReviewAPI } from "./reviewAPI";

// ===================== GET REVIEWS =====================
export const fetchReviews = createAsyncThunk(
  "reviews/fetch",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getProductReviewsAPI(productId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

// ===================== ADD REVIEW =====================
export const addReview = createAsyncThunk(
  "reviews/add",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await addReviewAPI(productId, reviewData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add review",
      );
    }
  },
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetReviewState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= FETCH =================
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= ADD =================
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
