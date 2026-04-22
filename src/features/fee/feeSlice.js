import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feeApi } from '../../api/feeApi';

export const fetchFees = createAsyncThunk(
  'fee/fetchFees',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await feeApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchStudentFees = createAsyncThunk(
  'fee/fetchStudentFees',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await feeApi.getStudentFees(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const generateMonthlyFees = createAsyncThunk(
  'fee/generateMonthlyFees',
  async (data, { rejectWithValue }) => {
    try {
      const response = await feeApi.generateMonthly(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const makePayment = createAsyncThunk(
  'fee/makePayment',
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await feeApi.makePayment(id, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchFeeStats = createAsyncThunk(
  'fee/fetchFeeStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await feeApi.getStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sendReminders = createAsyncThunk(
  'fee/sendReminders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await feeApi.sendReminders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  fees: [],
  studentFees: {
    data: [],
    summary: null,
  },
  currentFee: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
};

const feeSlice = createSlice({
  name: 'fee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentFees.fulfilled, (state, action) => {
        state.studentFees = {
          data: action.payload.data,
          summary: action.payload.summary,
        };
      })
      .addCase(generateMonthlyFees.fulfilled, (state, action) => {
        state.fees = [...action.payload.data, ...state.fees];
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        const index = state.fees.findIndex(f => f._id === action.payload.data.fee._id);
        if (index !== -1) {
          state.fees[index] = action.payload.data.fee;
        }
        const studentIndex = state.studentFees.data.findIndex(f => f._id === action.payload.data.fee._id);
        if (studentIndex !== -1) {
          state.studentFees.data[studentIndex] = action.payload.data.fee;
        }
      })
      .addCase(fetchFeeStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError } = feeSlice.actions;
export default feeSlice.reducer;