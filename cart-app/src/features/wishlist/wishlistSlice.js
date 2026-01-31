import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWishlistAPI,
  addToWishlistAPI,
  removeFromWishlistAPI,
} from "./wishlistAPI";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getWishlistAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch wishlist");
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addToWishlistAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add to wishlist");
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (id, { rejectWithValue }) => {
    try {
      const res = await removeFromWishlistAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to remove from wishlist",
      );
    }
  },
);

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist.push(action.payload.product);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = state.wishlist.filter(
          (item) => item.product._id !== action.payload._id,
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
export const selectWishlist = (state) => state.wishlist.wishlist;
