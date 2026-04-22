import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentApi } from '../../api/studentApi';
import { roomApi } from '../../api/roomApi';
import { feeApi } from '../../api/feeApi';
import { attendanceApi } from '../../api/attendanceApi';
import { leaveApi } from '../../api/leaveApi';
import { complaintApi } from '../../api/complaintApi';

// Async Thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [studentStats, roomStats, feeStats, todayAttendance, leaveStats, complaintStats] = await Promise.all([
        studentApi.getStats(),
        roomApi.getStats(),
        feeApi.getStats(),
        attendanceApi.getTodaySummary(),
        leaveApi.getStats(),
        complaintApi.getStats(),
      ]);
      
      return {
        studentStats: studentStats.data.data,
        roomStats: roomStats.data.data,
        feeStats: feeStats.data.data,
        todayAttendance: todayAttendance.data.data,
        leaveStats: leaveStats.data.data,
        complaintStats: complaintStats.data.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch recent data from various endpoints
      const [recentStudents, recentLeaves, recentComplaints, recentFees] = await Promise.all([
        studentApi.getAll({ limit: 5, sort: '-createdAt' }),
        leaveApi.getAll({ limit: 5, sort: '-appliedOn' }),
        complaintApi.getAll({ limit: 5, sort: '-createdAt' }),
        feeApi.getAll({ limit: 5, sort: '-createdAt' }),
      ]);
      
      const activities = [
        ...recentStudents.data.data.map(s => ({
          id: s._id,
          type: 'student',
          title: `New student registered: ${s.userId?.name}`,
          time: s.createdAt,
          icon: 'user',
          color: 'green',
        })),
        ...recentLeaves.data.data.map(l => ({
          id: l._id,
          type: 'leave',
          title: `Leave request from ${l.studentId?.userId?.name}`,
          time: l.appliedOn,
          icon: 'calendar',
          color: 'yellow',
        })),
        ...recentComplaints.data.data.map(c => ({
          id: c._id,
          type: 'complaint',
          title: `New complaint: ${c.title}`,
          time: c.createdAt,
          icon: 'alert',
          color: 'red',
        })),
        ...recentFees.data.data.map(f => ({
          id: f._id,
          type: 'fee',
          title: `Fee payment received from ${f.studentId?.userId?.name}`,
          time: f.updatedAt,
          icon: 'money',
          color: 'blue',
        })),
      ];
      
      // Sort by time (most recent first)
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      return activities.slice(0, 10);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async ({ type, period } = {}, { rejectWithValue }) => {
    try {
      let data = {};
      
      switch (type) {
        case 'attendance':
          const attendanceStats = await attendanceApi.getStats({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
          data.attendance = attendanceStats.data.data;
          break;
        case 'fees':
          const feeStats = await feeApi.getStats();
          data.fees = feeStats.data.data;
          break;
        case 'complaints':
          const complaintStats = await complaintApi.getStats();
          data.complaints = complaintStats.data.data;
          break;
        default:
          // Fetch all chart data
          const [attendance, fees, complaints] = await Promise.all([
            attendanceApi.getStats({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
            feeApi.getStats(),
            complaintApi.getStats(),
          ]);
          data = {
            attendance: attendance.data.data,
            fees: fees.data.data,
            complaints: complaints.data.data,
          };
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'dashboard/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const [pendingLeaves, pendingComplaints, overdueFees] = await Promise.all([
        leaveApi.getPending(),
        complaintApi.getAll({ status: 'pending' }),
        feeApi.getAll({ status: 'overdue' }),
      ]);
      
      const notifications = [
        ...pendingLeaves.data.data.map(l => ({
          id: l._id,
          type: 'leave',
          title: 'Pending Leave Request',
          message: `${l.studentId?.userId?.name} has requested leave from ${new Date(l.fromDate).toLocaleDateString()}`,
          priority: 'medium',
          read: false,
          link: `/admin/leaves/${l._id}`,
        })),
        ...pendingComplaints.data.data.map(c => ({
          id: c._id,
          type: 'complaint',
          title: 'Pending Complaint',
          message: `${c.title} - ${c.category}`,
          priority: c.priority === 'emergency' ? 'high' : 'medium',
          read: false,
          link: `/admin/complaints/${c._id}`,
        })),
        ...overdueFees.data.data.map(f => ({
          id: f._id,
          type: 'fee',
          title: 'Overdue Fee Payment',
          message: `${f.studentId?.userId?.name} has overdue fee of ₹${f.balance}`,
          priority: 'high',
          read: false,
          link: `/admin/fees/${f._id}`,
        })),
      ];
      
      return notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  data: null,
  recentActivities: [],
  chartData: null,
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null,
  refreshInterval: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.recentActivities = [];
      state.chartData = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount++;
      }
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
    },
    updateLastFetched: (state) => {
      state.lastFetched = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Recent Activities
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Chart Data
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearDashboard, 
  clearError, 
  markNotificationRead, 
  markAllNotificationsRead, 
  addNotification,
  setRefreshInterval,
  updateLastFetched 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;