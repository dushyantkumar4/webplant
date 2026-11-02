
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api.js";

// Get Tasks (with optional filters)
export const getTasks = createAsyncThunk(
  "tasks/getAll",
  async ({ projectId, status, sort = "asc" }, { rejectWithValue }) => {
    try {
      const params = { sort };

      if (status && status !== "all") {
        params.status = status;
      }

      const { data } = await api.get(
        `/projects/${projectId}/tasks`,
        { params }
      );

      return data.tasks;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

// Create Task
export const createTask = createAsyncThunk(
  "tasks/create",
  async ({ projectId, taskData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        `/projects/${projectId}/tasks`,
        taskData
      );

      return data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ projectId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/projects/${projectId}/tasks/${taskId}`,
        taskData
      );

      return data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      await api.delete(
        `/projects/${projectId}/tasks/${taskId}`
      );

      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",

  initialState: {
    tasks: [],
    isLoading: false,
    error: null,
  },

  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },

    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get Tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;

        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskError, clearTasks } = taskSlice.actions;

export default taskSlice.reducer;
