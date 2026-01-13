import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getSellerRequestsAPI,
  approveSellerRequestAPI,
  rejectSellerRequestAPI,
  createSellerRequestAPI,
  updateSellerUserRoleAPI,
  deleteSellerRequestAPI,
} from "./sellerRequestAPI";

export const fetchSellerRequests = createAsyncThunk(
  "sellerRequest/fetchSellerRequests",
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

export const approveSellerRequest = createAsyncThunk(
  "sellerRequest/approveSellerRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await approveSellerRequestAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to approve seller request"
      );
    }
  }
);

export const rejectSellerRequest = createAsyncThunk(
  "sellerRequest/rejectSellerRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await rejectSellerRequestAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject seller request"
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

export const updateSellerUserRole = createAsyncThunk(
  "sellerRequest/updateSellerUserRole",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateSellerUserRoleAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update seller role"
      );
    }
  }
);

export const deleteSellerRequest = createAsyncThunk(
  "sellerRequest/deleteSellerRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteSellerRequestAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete seller request"
      );
    }
  }
);

const sellerRequestSlice = createSlice({
  name: "sellerRequest",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSellerRequests.pending, (state) => {
      state.loading = true;
      state.status = "loading";
    });
    builder.addCase(fetchSellerRequests.fulfilled, (state, action) => {
      state.loading = false;
      state.requests = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(fetchSellerRequests.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.status = "failed";
    });

    builder.addCase(approveSellerRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(approveSellerRequest.fulfilled, (state, action) => {
      state.loading = false;
      const updatedRequest = action.payload;
      state.requests = state.requests.map((request) => {
        if (request._id === updatedRequest._id) {
          return updatedRequest;
        }
        return request;
      });
    });
    builder.addCase(approveSellerRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(rejectSellerRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rejectSellerRequest.fulfilled, (state, action) => {
      state.loading = false;
      const updatedRequest = action.payload;
      state.requests = state.requests.map((request) => {
        if (request._id === updatedRequest._id) {
          return updatedRequest;
        }
        return request;
      });
    });
    builder.addCase(rejectSellerRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(createSellerRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createSellerRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.requests.push(action.payload);
    });
    builder.addCase(createSellerRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateSellerUserRole.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateSellerUserRole.fulfilled, (state, action) => {
      state.loading = false;
      const updatedUser = action.payload;

      state.requests = state.requests.map((req) =>
        req.user?._id === updatedUser._id ? { ...req, user: updatedUser } : req
      );
    });

    builder.addCase(updateSellerUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteSellerRequest.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteSellerRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.requests = state.requests.filter(
        (request) => request._id !== action.payload._id
      );
    });
    builder.addCase(deleteSellerRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default sellerRequestSlice.reducer;

export const selectSellerRequests = (state) => state.sellerRequest.requests;
export const selectSellerRequestLoading = (state) =>
  state.sellerRequest.loading;
export const selectSellerRequestError = (state) => state.sellerRequest.error;
