import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle, logoutUser, getCurrentUser } from '../../firebase/config';

const initialState = {
  user: null,
  isAdmin: false,
  loading: false,
  error: null,
};

// Google Login
export const googleLogin = createAsyncThunk('auth/googleLogin', async () => {
  const result = await signInWithGoogle();
  if (result.success) {
    return { user: result.user, isAdmin: result.isAdmin };
  } else {
    throw new Error(result.error);
  }
});

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutUser();
  return null;
});

// current user
export const checkUser = createAsyncThunk('auth/checkUser', async () => {
  const user = await getCurrentUser();
  return user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAdmin = action.payload.isAdmin;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAdmin = false;
        state.loading = false;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAdmin = action.payload.isAdmin || false;
        }
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;