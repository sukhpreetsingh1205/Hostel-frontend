import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { complaintApi } from '../../api/complaintApi';

// Async Thunks
export const fetchComplaints = createAsyncThunk(
  'complaint/fetchComplaints',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await complaintApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  'complaint/fetchComplaintById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await complaintApi.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchStudentComplaints = createAsyncThunk(
  'complaint/fetchStudentComplaints',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await complaintApi.getStudentComplaints(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createComplaint = createAsyncThunk(
  'complaint/createComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await complaintApi.create(complaintData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateComplaint = createAsyncThunk(
  'complaint/updateComplaint',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await complaintApi.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const assignComplaint = createAsyncThunk(
  'complaint/assignComplaint',
  async ({ id, assignedTo }, { rejectWithValue }) => {
    try {
      const response = await complaintApi.assign(id, assignedTo);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const resolveComplaint = createAsyncThunk(
  'complaint/resolveComplaint',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await complaintApi.resolve(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const closeComplaint = createAsyncThunk(
  'complaint/closeComplaint',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await complaintApi.close(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'complaint/addComment',
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const response = await complaintApi.addComment(id, comment);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchComplaintStats = createAsyncThunk(
  'complaint/fetchComplaintStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await complaintApi.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  complaints: [],
  currentComplaint: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    status: '',
    priority: '',
    category: '',
    fromDate: null,
    toDate: null,
  },
  loading: false,
  error: null,
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    clearComplaints: (state) => {
      state.complaints = [];
      state.currentComplaint = null;
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
        priority: '',
        category: '',
        fromDate: null,
        toDate: null,
      };
    },
    clearCurrentComplaint: (state) => {
      state.currentComplaint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Complaints
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Complaint By ID
      .addCase(fetchComplaintById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentComplaint = action.payload;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Student Complaints
      .addCase(fetchStudentComplaints.fulfilled, (state, action) => {
        state.complaints = action.payload.data;
        state.stats = action.payload.stats;
      })
      
      // Create Complaint
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.unshift(action.payload);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Complaint
      .addCase(updateComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.currentComplaint?._id === action.payload._id) {
          state.currentComplaint = action.payload;
        }
      })
      
      // Assign Complaint
      .addCase(assignComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.currentComplaint?._id === action.payload._id) {
          state.currentComplaint = action.payload;
        }
      })
      
      // Resolve Complaint
      .addCase(resolveComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.currentComplaint?._id === action.payload._id) {
          state.currentComplaint = action.payload;
        }
      })
      
      // Close Complaint
      .addCase(closeComplaint.fulfilled, (state, action) => {
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
        if (state.currentComplaint?._id === action.payload._id) {
          state.currentComplaint = action.payload;
        }
      })
      
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentComplaint?._id === action.payload._id) {
          state.currentComplaint = action.payload;
        }
        const index = state.complaints.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.complaints[index] = action.payload;
        }
      })
      
      // Fetch Complaint Stats
      .addCase(fetchComplaintStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  },
});

export const { 
  clearComplaints, 
  clearError, 
  setPagination, 
  setFilters, 
  clearFilters,
  clearCurrentComplaint 
} = complaintSlice.actions;

export default complaintSlice.reducer;