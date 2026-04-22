import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaveApi } from '../../api/leaveApi';

// Async Thunks
export const fetchLeaves = createAsyncThunk(
  'leave/fetchLeaves',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  'leave/fetchLeaveById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchStudentLeaves = createAsyncThunk(
  'leave/fetchStudentLeaves',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getStudentLeaves(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createLeave = createAsyncThunk(
  'leave/createLeave',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await leaveApi.create(leaveData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateLeave = createAsyncThunk(
  'leave/updateLeave',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leave/approveLeave',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.approve(id, remarks);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leave/rejectLeave',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.reject(id, rejectionReason);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const cancelLeave = createAsyncThunk(
  'leave/cancelLeave',
  async (id, { rejectWithValue }) => {
    try {
      const response = await leaveApi.cancel(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchPendingLeaves = createAsyncThunk(
  'leave/fetchPendingLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getPending();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchLeaveStats = createAsyncThunk(
  'leave/fetchLeaveStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  leaves: [],
  currentLeave: null,
  pendingLeaves: [],
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
  filters: {
    status: '',
    type: '',
    fromDate: null,
    toDate: null,
  },
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearLeaves: (state) => {
      state.leaves = [];
      state.currentLeave = null;
      state.pendingLeaves = [];
      state.stats = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        type: '',
        fromDate: null,
        toDate: null,
      };
    },
    clearCurrentLeave: (state) => {
      state.currentLeave = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Leave By ID
      .addCase(fetchLeaveById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLeave = action.payload;
      })
      .addCase(fetchLeaveById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Student Leaves
      .addCase(fetchStudentLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload.data;
        state.stats = action.payload.stats;
      })
      
      // Create Leave
      .addCase(createLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.unshift(action.payload);
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Leave
      .addCase(updateLeave.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.currentLeave?._id === action.payload._id) {
          state.currentLeave = action.payload;
        }
      })
      
      // Approve Leave
      .addCase(approveLeave.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        const pendingIndex = state.pendingLeaves.findIndex(l => l._id === action.payload._id);
        if (pendingIndex !== -1) {
          state.pendingLeaves.splice(pendingIndex, 1);
        }
        if (state.currentLeave?._id === action.payload._id) {
          state.currentLeave = action.payload;
        }
      })
      
      // Reject Leave
      .addCase(rejectLeave.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        const pendingIndex = state.pendingLeaves.findIndex(l => l._id === action.payload._id);
        if (pendingIndex !== -1) {
          state.pendingLeaves.splice(pendingIndex, 1);
        }
        if (state.currentLeave?._id === action.payload._id) {
          state.currentLeave = action.payload;
        }
      })
      
      // Cancel Leave
      .addCase(cancelLeave.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.leaves[index] = action.payload;
        }
        if (state.currentLeave?._id === action.payload._id) {
          state.currentLeave = action.payload;
        }
      })
      
      // Fetch Pending Leaves
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.pendingLeaves = action.payload.data;
      })
      
      // Fetch Leave Stats
      .addCase(fetchLeaveStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  },
});

export const { 
  clearLeaves, 
  clearError, 
  setPagination, 
  setFilters, 
  clearFilters,
  clearCurrentLeave 
} = leaveSlice.actions;

export default leaveSlice.reducer;