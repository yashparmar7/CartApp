import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProductsAPI,
  getSingleProductAPI,
  getAllProductsAdminAPI,
  updateSellerProductStatusAPI,
  softDeleteSellerProductAPI,
} from "./productAPI";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllProductsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getSingleProductAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const getAllProductsAdmin = createAsyncThunk(
  "product/getAllProductsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllProductsAdminAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const updateSellerProductStatus = createAsyncThunk(
  "product/updateSellerProductStatus",
  async ({ id, status, adminNote }, { rejectWithValue }) => {
    try {
      const res = await updateSellerProductStatusAPI(id, {
        status,
        adminNote,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product status"
      );
    }
  }
);

export const softDeleteSellerProduct = createAsyncThunk(
  "product/softDeleteSellerProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await softDeleteSellerProductAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  products: [],
  singleProduct: {},
  loading: false,
  error: null,
};
export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })

      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getAllProductsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(getAllProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateSellerProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellerProductStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProduct = action.payload.product;

        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(updateSellerProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(softDeleteSellerProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteSellerProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload._id
        );
      })
      .addCase(softDeleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProducts = (state) => state.product.products;
export const selectSingleProduct = (state) => state.product.singleProduct;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;

export default productSlice.reducer;
