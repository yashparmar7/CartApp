import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import sellerRequestReducer from "../features/sellerRequest/sellerRequestSlice";
import categoryReducer from "../features/category/categorySlice";
import roleReducer from "../features/role/roleSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    sellerRequest: sellerRequestReducer,
    category: categoryReducer,
    role: roleReducer,
  },
});

export default store;
