import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceApi } from '../../api/attendanceApi';

// Async Thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchStudentAttendance = createAsyncThunk(
  'attendance/fetchStudentAttendance',
  async ({ studentId, month, year }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getStudentAttendance(studentId, { month, year });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAttendanceByDate = createAsyncThunk(
  'attendance/fetchAttendanceByDate',
  async (date, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getByDate(date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.markAttendance(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchAttendanceStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchTodaySummary = createAsyncThunk(
  'attendance/fetchTodaySummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getTodaySummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  attendance: [],
  currentAttendance: null,
  studentAttendance: {
    data: [],
    summary: null,
  },
  dateWiseAttendance: [],
  stats: null,
  todaySummary: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
  lastFetched: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendance: (state) => {
      state.attendance = [];
      state.currentAttendance = null;
      state.studentAttendance = { data: [], summary: null };
      state.dateWiseAttendance = [];
      state.stats = null;
      state.todaySummary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCurrentAttendance: (state) => {
      state.currentAttendance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
        state.pagination = action.payload.pagination;
        state.lastFetched = Date.now();
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Student Attendance
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAttendance = {
          data: action.payload.data,
          summary: action.payload.summary,
        };
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Attendance By Date
      .addCase(fetchAttendanceByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.dateWiseAttendance = action.payload.data;
      })
      .addCase(fetchAttendanceByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        // Update the attendance records
        if (action.payload.data?.success) {
          action.payload.data.success.forEach(record => {
            const index = state.attendance.findIndex(a => a.studentId === record.studentId);
            if (index !== -1) {
              state.attendance[index] = record;
            } else {
              state.attendance.unshift(record);
            }
          });
        }
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex(a => a._id === action.payload.data._id);
        if (index !== -1) {
          state.attendance[index] = action.payload.data;
        }
        state.currentAttendance = action.payload.data;
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Attendance Stats
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Today Summary
      .addCase(fetchTodaySummary.fulfilled, (state, action) => {
        state.todaySummary = action.payload.data;
      });
  },
});

export const { 
  clearAttendance, 
  clearError, 
  setPagination, 
  clearCurrentAttendance 
} = attendanceSlice.actions;

export default attendanceSlice.reducer;