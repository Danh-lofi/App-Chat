import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../api/authApi";
let user = JSON.parse(localStorage.getItem("user"));
if (user) {
  user = user.user;
}

export const login = createAsyncThunk(
  "/login",
  async ({ username, password }) => {
    try {
      const res = await authApi.login(username, password);
      return { data: res.data, status: res.status };
    } catch (error) {
      return error.response;
    }
  }
);

export const register = createAsyncThunk(
  "/register",
  async ({ username, password }) => {
    try {
      const response = await authApi.register(username, password);
      return { data: response.data, status: response.status };
    } catch (error) {}
  }
);

export const registerInfo = createAsyncThunk(
  "/register/info",
  async ({ user }) => {
    try {
      const response = await authApi.registerInfomation(user);
      return { data: response.data, status: response.status };
    } catch (error) {
      console.log(error);
    }
  }
);

export const registerVerify = createAsyncThunk(
  "/register/verify",
  async (username) => {
    try {
      const response = await authApi.verifyUsername(username);
      return { data: response.data, status: response.status };
    } catch (error) {
      return error.response;
    }
  }
);

export const profile = createAsyncThunk("/profile", async (accessToken) => {
  try {
    const response = await authApi.profile(accessToken);
    return { data: response.data, status: response.status };
  } catch (error) {
    console.log(error.response.status);
    return { status: error.response.status };
  }
});

export const existUsername = createAsyncThunk("/forgot", async (username) => {
  try {
    const response = await authApi.existUsername(username);
    return { data: response.data, status: response.status };
  } catch (error) {
    return error.response;
  }
});

// /forgot/reset-password
export const resetPassword = createAsyncThunk(
  "/forgot/reset-password",
  async (username, password) => {
    try {
      const response = await authApi.resetPassword(username, password);
      return { data: response.data, status: response.status };
    } catch (error) {
      return error.response;
    }
  }
);

const initialState = user
  ? { isLoggedIn: true, user: user }
  : { isLoggedIn: false, user: null };

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      if (!action.payload) return;
      state.isLoggedIn = false;
      state.user = action.payload.data.user;
      state = JSON.parse(JSON.stringify(state));
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      if (!action.payload.data.user) return;
      state.isLoggedIn = true;
      state.user = action.payload.data.user;
      state = JSON.parse(JSON.stringify(state));
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [profile.fulfilled]: (state, action) => {
      if (!action.payload) return;
      state.isLoggedIn = true;
      if (action.payload.data) {
        state.user = action.payload.data.user;
      }
    },
    [profile.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [existUsername.fulfilled]: (state, action) => {
      if (!action.payload) return;
      state.isLoggedIn = false;
      state.user = action.payload.data.username;
    },
    [resetPassword.fulfilled]: (state, action) => {
      if (!action.payload) return;
      state.isLoggedIn = false;
      state.user = action.payload.data.username;
    },
    // [logout.fulfilled]: (state, action) => {
    //   state.isLoggedIn = false;
    //   state.user = null;
    // },
  },
  reducers: {
    logOut: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.setItem("user", JSON.stringify(null));
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
    },
    setLogin: (state) => {
      state.isLoggedIn = true;
    },
    setFriend: (state, action) => {
      state.group = null;
      state.friend = action.payload;
    },
    setNullFriend: (state) => {
      state.friend = null;
    },
    changeInfo: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
