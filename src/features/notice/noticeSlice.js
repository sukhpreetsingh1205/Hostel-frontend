import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { noticeApi } from '../../api/noticeApi';

// Async Thunks
export const fetchNotices = createAsyncThunk(
  'notice/fetchNotices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await noticeApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchActiveNotices = createAsyncThunk(
  'notice/fetchActiveNotices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await noticeApi.getActive();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchNoticeById = createAsyncThunk(
  'notice/fetchNoticeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await noticeApi.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createNotice = createAsyncThunk(
  'notice/createNotice',
  async (noticeData, { rejectWithValue }) => {
    try {
      const response = await noticeApi.create(noticeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateNotice = createAsyncThunk(
  'notice/updateNotice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await noticeApi.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteNotice = createAsyncThunk(
  'notice/deleteNotice',
  async (id, { rejectWithValue }) => {
    try {
      await noticeApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const togglePinNotice = createAsyncThunk(
  'notice/togglePinNotice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await noticeApi.togglePin(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchNoticeStats = createAsyncThunk(
  'notice/fetchNoticeStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await noticeApi.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const archiveExpiredNotices = createAsyncThunk(
  'notice/archiveExpiredNotices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await noticeApi.archive();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  notices: [],
  activeNotices: {
    pinned: [],
    recent: [],
  },
  currentNotice: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    category: '',
    priority: '',
    isActive: '',
    search: '',
  },
  loading: false,
  error: null,
};

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    clearNotices: (state) => {
      state.notices = [];
      state.activeNotices = { pinned: [], recent: [] };
      state.currentNotice = null;
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
        category: '',
        priority: '',
        isActive: '',
        search: '',
      };
    },
    clearCurrentNotice: (state) => {
      state.currentNotice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Notices
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Active Notices
      .addCase(fetchActiveNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.activeNotices = action.payload.data;
      })
      .addCase(fetchActiveNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Notice By ID
      .addCase(fetchNoticeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoticeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotice = action.payload;
      })
      .addCase(fetchNoticeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Notice
      .addCase(createNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.notices.unshift(action.payload);
        if (action.payload.isActive && new Date(action.payload.validTill) > new Date()) {
          if (action.payload.isPinned) {
            state.activeNotices.pinned.unshift(action.payload);
          } else {
            state.activeNotices.recent.unshift(action.payload);
          }
        }
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Notice
      .addCase(updateNotice.fulfilled, (state, action) => {
        const index = state.notices.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notices[index] = action.payload;
        }
        if (state.currentNotice?._id === action.payload._id) {
          state.currentNotice = action.payload;
        }
        // Update active notices
        const pinnedIndex = state.activeNotices.pinned.findIndex(n => n._id === action.payload._id);
        if (pinnedIndex !== -1) {
          state.activeNotices.pinned[pinnedIndex] = action.payload;
        }
        const recentIndex = state.activeNotices.recent.findIndex(n => n._id === action.payload._id);
        if (recentIndex !== -1) {
          state.activeNotices.recent[recentIndex] = action.payload;
        }
      })
      
      // Delete Notice
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(n => n._id !== action.payload);
        state.activeNotices.pinned = state.activeNotices.pinned.filter(n => n._id !== action.payload);
        state.activeNotices.recent = state.activeNotices.recent.filter(n => n._id !== action.payload);
        if (state.currentNotice?._id === action.payload) {
          state.currentNotice = null;
        }
      })
      
      // Toggle Pin Notice
      .addCase(togglePinNotice.fulfilled, (state, action) => {
        const notice = action.payload;
        // Update in notices array
        const index = state.notices.findIndex(n => n._id === notice._id);
        if (index !== -1) {
          state.notices[index] = notice;
        }
        // Move between pinned and recent
        if (notice.isPinned) {
          state.activeNotices.pinned.unshift(notice);
          state.activeNotices.recent = state.activeNotices.recent.filter(n => n._id !== notice._id);
        } else {
          state.activeNotices.recent.unshift(notice);
          state.activeNotices.pinned = state.activeNotices.pinned.filter(n => n._id !== notice._id);
        }
        if (state.currentNotice?._id === notice._id) {
          state.currentNotice = notice;
        }
      })
      
      // Fetch Notice Stats
      .addCase(fetchNoticeStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })
      
      // Archive Expired Notices
      .addCase(archiveExpiredNotices.fulfilled, (state, action) => {
        // Refresh notices after archiving
        // This will be handled by fetching again if needed
        console.log('Archived notices:', action.payload);
      });
  },
});

export const { 
  clearNotices, 
  clearError, 
  setPagination, 
  setFilters, 
  clearFilters,
  clearCurrentNotice 
} = noticeSlice.actions;

export default noticeSlice.reducer;