import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
