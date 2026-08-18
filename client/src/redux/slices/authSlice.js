import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/utils";

// Async thunk for checking user authentication status
export const checkUserAuthStatus = createAsyncThunk(
  "auth/checkUserAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/checkAuthenticated`, {
        withCredentials: true,
      });
      return response?.data;
    } catch (error) {
      // If user is not authenticated, return false instead of throwing error
      if (error.response?.status === 401) {
        return { isAuthenticated: false, user: null };
      }
      return rejectWithValue(error.response?.data?.message || "Authentication check failed");
    }
  }
);
// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(
    `${BASE_URL}/users/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers for other sync actions
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
      state.isAuthenticated = true;
      console.log("Setting user profile directly:", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserAuthStatus.fulfilled, (state, action) => {
        console.log("Auth status check response:", action.payload);
        state.isAuthenticated = action.payload.isAuthenticated;
        state.userProfile = action.payload.user;
        state.loading = false;
        console.log("Updated userProfile in state:", action.payload.user);
      })
      .addCase(checkUserAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userProfile = null;
        state.error = action.payload || "Authentication check failed";
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.userProfile = null;
        state.loading = false;
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUserProfile } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
