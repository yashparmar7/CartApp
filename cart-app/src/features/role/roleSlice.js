import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUserAPI, updateUserRoleAPI, deleteUserAPI } from "./roleAPI";

export const getAllUsers = createAsyncThunk(
  "role/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllUserAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch users");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "role/updateUser",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const res = await updateUserRoleAPI(userId, { role });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "role/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await deleteUserAPI(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete user");
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) => {
          if (user._id === action.payload.user._id) {
            return action.payload.user;
          }
          return user;
        });
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload._id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;

export const selectUsers = (state) => state.role.users;
export const selectLoading = (state) => state.role.loading;
export const selectError = (state) => state.role.error;
