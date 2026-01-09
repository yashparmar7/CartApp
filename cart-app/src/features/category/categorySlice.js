import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCategoriesAPI,
  createCategoryAPI,
  deleteCategoryAPI,
  updateCategoryAPI,
} from "./categoryAPI";

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllCategoriesAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch categories"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createCategoryAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCategoryAPI(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload.category);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        return state;
      });

    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        return state;
      });

    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        return state;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map((category) => {
          if (category._id === action.payload._id) {
            return action.payload;
          }
          return category;
        });
        return state;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        return state;
      });
  },
});

export default categorySlice.reducer;

export const categorySelector = (state) => state.category;
