import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getSellerRequestsAPI,
  updateSellerRequestAPI,
  createSellerRequestAPI,
} from "./sellerRequestAPI";

export const getSellerRequests = createAsyncThunk(
  "sellerRequest/getSellerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellerRequestsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch seller requests"
      );
    }
  }
);

export const updateSellerRequest = createAsyncThunk(
  "sellerRequest/updateSellerRequest",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateSellerRequestAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update seller request"
      );
    }
  }
);

export const createSellerRequest = createAsyncThunk(
  "sellerRequest/createSellerRequest",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createSellerRequestAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create seller request"
      );
    }
  }
);

const sellerRequestSlice = createSlice({
  name: "sellerRequest",
  initialState: {
    sellerRequests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getSellerRequests.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSellerRequests.fulfilled, (state, action) => {
      state.loading = false;
      state.sellerRequests = action.payload;
    });
    builder.addCase(getSellerRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateSellerRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSellerRequest.fulfilled, (state, action) => {
      state.loading = false;
      const updatedRequest = action.payload;
      state.sellerRequests = state.sellerRequests.map((request) => {
        if (request._id === updatedRequest._id) {
          return updatedRequest;
        }
        return request;
      });
    });
    builder.addCase(updateSellerRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(createSellerRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSellerRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.sellerRequests.push(action.payload);
    });
    builder.addCase(createSellerRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default sellerRequestSlice.reducer;
