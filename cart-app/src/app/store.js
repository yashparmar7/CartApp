import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;
