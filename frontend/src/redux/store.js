import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice.js";
import projectReducer from "./projectSlice.js";
import taskReducer from "./taskSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
  },
});