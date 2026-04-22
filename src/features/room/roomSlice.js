import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roomApi } from '../../api/roomApi';

export const fetchRooms = createAsyncThunk(
  'room/fetchRooms',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await roomApi.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchRoomById = createAsyncThunk(
  'room/fetchRoomById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await roomApi.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await roomApi.create(roomData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateRoom = createAsyncThunk(
  'room/updateRoom',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await roomApi.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'room/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await roomApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const allotRoom = createAsyncThunk(
  'room/allotRoom',
  async ({ roomId, studentId }, { rejectWithValue }) => {
    try {
      const response = await roomApi.allotRoom(roomId, studentId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const vacateRoom = createAsyncThunk(
  'room/vacateRoom',
  async ({ roomId, studentId }, { rejectWithValue }) => {
    try {
      const response = await roomApi.vacateRoom(roomId, studentId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchAvailableRooms = createAsyncThunk(
  'room/fetchAvailableRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roomApi.getAvailable();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchRoomStats = createAsyncThunk(
  'room/fetchRoomStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roomApi.getStats();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  rooms: [],
  currentRoom: null,
  availableRooms: [],
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

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.currentRoom = action.payload;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.unshift(action.payload);
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter(r => r._id !== action.payload);
      })
      .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
        state.availableRooms = action.payload;
      })
      .addCase(fetchRoomStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCurrentRoom, clearError } = roomSlice.actions;
export default roomSlice.reducer;