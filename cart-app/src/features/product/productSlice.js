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

export const getSellerMyProducts = createAsyncThunk(
  "product/getSellerMyProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSellerMyProductsAPI();
      return res.data.products;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async ({ query, category }, { rejectWithValue }) => {
    try {
      const res = await searchProductsAPI(query, category);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to search products"
      );
    }
  }
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

      fd.append("price", formData.pricing.price);
      fd.append("mrp", formData.pricing.mrp);

      fd.append("stock", formData.stock);

      fd.append("estimated", formData.delivery.estimated);
      fd.append("cost", formData.delivery.cost);
      fd.append("codAvailable", formData.delivery.codAvailable);

      fd.append("offers", formData.offers);

      images.forEach((img) => {
        fd.append("images", img);
      });

      const res = await createProductAPI(fd);

      return res.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
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

      fd.append("price", formData.pricing.price);
      fd.append("mrp", formData.pricing.mrp);

      fd.append("stock", formData.stock);

      fd.append("estimated", formData.delivery.estimated);
      fd.append("cost", formData.delivery.cost);
      fd.append("codAvailable", formData.delivery.codAvailable);

      fd.append("offers", formData.offers);

      images.forEach((img) => {
        fd.append("images", img);
      });

      removedImages.forEach((imgUrl) => {
        fd.append("removedImages", imgUrl);
      });

      const res = await updateProductAPI(id, fd);

      return res.data.product;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteProductAPI(id);
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
  myProducts: [],
  loading: false,
  error: null,
  productsStatus: "idle",
  productsAdminStatus: "idle",
  sellerProductsStatus: "idle",
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

        state.myProducts = state.myProducts.filter(
          (product) => product._id !== action.payload._id
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
          product._id === action.payload._id ? action.payload : product
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
          (product) => product._id !== action.payload._id
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
export const selectSingleProduct = (state) => state.product.singleProduct;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectMyProducts = (state) => state.product.myProducts;

export default productSlice.reducer;
