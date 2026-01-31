import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProductsAPI,
  getSingleProductAPI,
  getAllProductsAdminAPI,
  updateSellerProductStatusAPI,
  softDeleteSellerProductAPI,
  getSellerMyProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  searchProductsAPI,
  getTopDealsAPI,
} from "./productAPI";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllProductsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const getTopDeals = createAsyncThunk(
  "product/getTopDeals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTopDealsAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch top deals",
      );
    }
  },
);

export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getSingleProductAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

export const getAllProductsAdmin = createAsyncThunk(
  "product/getAllProductsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllProductsAdminAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
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
        err.response?.data?.message || "Failed to update product status",
      );
    }
  },
);

export const softDeleteSellerProduct = createAsyncThunk(
  "product/softDeleteSellerProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await softDeleteSellerProductAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

export const getSellerMyProducts = createAsyncThunk(
  "product/getSellerMyProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellerMyProductsAPI();
      return res.data.products;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async ({ query, category }, { rejectWithValue }) => {
    try {
      const res = await searchProductsAPI(query, category);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to search products",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async ({ formData, images }, { rejectWithValue }) => {
    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("brand", formData.brand);
      fd.append("description", formData.description);
      fd.append("category", formData.category);

      fd.append("pricing", JSON.stringify(formData.pricing));

      fd.append("stock", formData.stock);

      fd.append("delivery", JSON.stringify(formData.delivery));

      fd.append("offers", JSON.stringify(formData.offers));

      // Top Deal fields
      fd.append("isTopDeal", formData.isTopDeal || false);
      if (formData.topDealStart) {
        fd.append("topDealStart", formData.topDealStart);
      }
      if (formData.topDealEnd) {
        fd.append("topDealEnd", formData.topDealEnd);
      }

      images.forEach((img) => {
        fd.append("images", img);
      });

      const res = await createProductAPI(fd);

      return res.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, formData, images, removedImages }, { rejectWithValue }) => {
    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("brand", formData.brand);
      fd.append("description", formData.description);
      fd.append("category", formData.category);

      fd.append("pricing", JSON.stringify(formData.pricing));

      fd.append("stock", formData.stock);

      fd.append("delivery", JSON.stringify(formData.delivery));

      fd.append("offers", JSON.stringify(formData.offers));

      fd.append("isActive", formData.isActive);

      images.forEach((img) => {
        fd.append("images", img);
      });

      removedImages.forEach((imgUrl) => {
        fd.append("removedImages", imgUrl);
      });

      // Top Deal fields
      fd.append("isTopDeal", formData.isTopDeal || false);
      if (formData.topDealStart) {
        fd.append("topDealStart", formData.topDealStart);
      }
      if (formData.topDealEnd) {
        fd.append("topDealEnd", formData.topDealEnd);
      }

      const res = await updateProductAPI(id, fd);

      return res.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteProductAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

const initialState = {
  products: [],
  singleProduct: {},
  myProducts: [],
  topDeals: [],
  loading: false,
  error: null,
  productsStatus: "idle",
  productsAdminStatus: "idle",
  sellerProductsStatus: "idle",
  topDealsStatus: "idle",
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
        state.productsStatus = "loading";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsStatus = "succeeded";
      })

      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productsStatus = "failed";
      })

      .addCase(getTopDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.topDealsStatus = "loading";
      })
      .addCase(getTopDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.topDeals = action.payload.products;
        state.topDealsStatus = "succeeded";
      })
      .addCase(getTopDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.topDealsStatus = "failed";
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
        state.productsAdminStatus = "loading";
      })
      .addCase(getAllProductsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productsAdminStatus = "succeeded";
      })
      .addCase(getAllProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productsAdminStatus = "failed";
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
          product._id === updatedProduct._id ? updatedProduct : product,
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
          (product) => product._id !== action.payload._id,
        );

        state.myProducts = state.myProducts.filter(
          (product) => product._id !== action.payload._id,
        );
      })

      .addCase(softDeleteSellerProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getSellerMyProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sellerProductsStatus = "loading";
      })
      .addCase(getSellerMyProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = action.payload;
        state.sellerProductsStatus = "succeeded";
      })
      .addCase(getSellerMyProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sellerProductsStatus = "failed";
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = state.myProducts.map((product) =>
          product._id === action.payload._id ? action.payload : product,
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = state.myProducts.filter(
          (product) => product._id !== action.payload._id,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProducts = (state) => state.product.products;
export const selectTopDeals = (state) => state.product.topDeals;
export const selectSingleProduct = (state) => state.product.singleProduct;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectMyProducts = (state) => state.product.myProducts;

export default productSlice.reducer;
