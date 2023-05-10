import { createSlice } from "@reduxjs/toolkit";
import { parseISO } from 'date-fns';

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends not found");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return action.payload.post;
        return post;
      });
      state.posts = updatedPost;
    },
    setUserDetails: (state, action) => {
      if (state.user) {
        state.user.phoneNumber = action.payload.phoneNumber;
        const dob = parseISO(state.user.dateOfBirth);
        state.user.dateOfBirth = dob.toISOString().substring(0,10);
        state.user.username = action.payload.username;
        state.user.email = action.payload.email;
        state.user.picture = action.payload.picture;
        state.user.gender = action.payload.gender;
      } else {
        console.error("User not found");
      }
    },
  },
});

export const {
  setMode,
  setFriends,
  setPosts,
  setPost,
  setLogin,
  setLogout,
  setUserDetails,
} = authSlice.actions;
export default authSlice.reducer;
