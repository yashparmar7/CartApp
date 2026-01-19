import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signupAPI,
  loginAPI,
  logoutAPI,
  verifyEmailAPI,
  resendVerificationEmailAPI,
} from "./authAPI";

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signupAPI(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginAPI(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  },
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutAPI();
  } catch (error) {
    console.warn("Logout API failed:", error);
  }
});

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyEmailAPI(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Email verification failed",
      );
    }
  },
);
export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await resendVerificationEmailAPI(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Resend verification email failed",
      );
    }
  },
);

let userFromLocalStorage = null;
const userStr = localStorage.getItem("user");
if (userStr && userStr !== "undefined" && userStr !== "null") {
  try {
    userFromLocalStorage = JSON.parse(userStr);
  } catch {
    localStorage.removeItem("user");
  }
}
const tokenFromLocalStorage = localStorage.getItem("token");

const initialState = {
  user: userFromLocalStorage || null,
  token: tokenFromLocalStorage || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
    // verify email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        // Email verification doesn't return user/token, just success message
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // resend verification email
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.user;

export default authSlice.reducer;
