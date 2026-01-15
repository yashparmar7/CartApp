import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrderAPI,
  getAllOrdersAPI,
  updateOrderAPI,
  deleteOrderAPI,
  getUserOrdersAPI,
  cancelOrderAPI,
  getSellerOrdersAPI,
} from "./orderAPI";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOrderAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllOrdersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get orders"
      );
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateOrderAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update order"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteOrderAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserOrdersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get user orders"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const res = await cancelOrderAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

export const getSellerOrders = createAsyncThunk(
  "order/getSellerOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellerOrdersAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get seller orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    loading: false,
    success: false,
    error: null,
  },

  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.orders = [];
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
        state.error = null;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.order = null;
        state.error = action.payload;
      });

    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload.orders || [];
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.orders = [];
        state.error = action.payload;
      });

    builder
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.order = null;
        state.error = action.payload;
      });

    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.orders = [];
        state.error = action.payload;
      });

    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.order = null;
        state.error = action.payload;
      });

    builder
      .addCase(getSellerOrders.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.orders = [];
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
export const { resetOrderState } = orderSlice.actions;

export const selectOrder = (state) => state.order.order;
export const selectOrders = (state) => state.order.orders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderSuccess = (state) => state.order.success;
export const selectOrderError = (state) => state.order.error;
