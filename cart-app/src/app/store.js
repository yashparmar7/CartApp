import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/product/productSlice";
import sellerRequestReducer from "../features/sellerRequest/sellerRequestSlice";
import categoryReducer from "../features/category/categorySlice";
import roleReducer from "../features/role/roleSlice";
import orderReducer from "../features/order/orderSlice";
import reviewReducer from "../features/review/reviewSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    sellerRequest: sellerRequestReducer,
    category: categoryReducer,
    role: roleReducer,
    order: orderReducer,
    review: reviewReducer,
  },
});

export default store;
