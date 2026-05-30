import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
import StatsCard from '../../components/dashboard/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import {
  FiUsers, FiGrid, FiDollarSign, FiCalendar,
  FiAlertCircle, FiClipboard, FiPlus, FiTrendingUp,
  FiArrowRight, FiBell, FiUserPlus
} from 'react-icons/fi';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import AttendanceOverviewCard from '../../components/attendance/AttendanceOverviewCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data, loading } = useSelector((s) => s.dashboard);

  useEffect(() => { dispatch(fetchDashboardData()); }, [dispatch]);

  if (loading && !data) return <LoadingSpinner />;

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#a1a1aa' : '#71717a';

  const stats = [
    { title: 'Total Students', value: data?.studentStats?.total || 0, icon: FiUsers, color: 'bg-blue-500', subtitle: 'enrolled' },
    { title: 'Total Rooms', value: data?.roomStats?.summary?.totalRooms || 0, icon: FiGrid, color: 'bg-emerald-500', subtitle: `${data?.roomStats?.summary?.availableRooms || 0} available` },
    { title: 'Pending Leaves', value: data?.leaveStats?.statusStats?.find(s => s._id === 'pending')?.count || 0, icon: FiClipboard, color: 'bg-amber-500', subtitle: 'awaiting review' },
    { title: 'Open Complaints', value: data?.complaintStats?.unresolvedCount || 0, icon: FiAlertCircle, color: 'bg-red-500', subtitle: 'unresolved' },
  ];

  const occupancyData = {
    labels: ['Occupied', 'Available', 'Maintenance'],
    datasets: [{
      data: [
        data?.roomStats?.summary?.occupiedRooms || 0,
        data?.roomStats?.summary?.availableRooms || 0,
        data?.roomStats?.summary?.maintenanceRooms || 0,
      ],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
      borderWidth: 0,
      borderRadius: 4,
    }],
  };

  const feeData = {
    labels: data?.feeStats?.monthlyCollection?.slice(0, 6).reverse().map(m => `${m._id.month}`) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Collection (₹)',
      data: data?.feeStats?.monthlyCollection?.slice(0, 6).reverse().map(m => m.totalCollected) || [85000, 92000, 88000, 95000, 91000, 98000],
      backgroundColor: theme === 'dark' ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.8)',
      borderRadius: 8,
      barThickness: 28,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 } } } },
    scales: {
      x: { ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { family: 'Inter', size: 11 } }, grid: { color: gridColor } },
    },
  };

  const quickActions = [
    { label: 'Add Student', icon: FiUsers, path: '/admin/students/new', color: 'text-blue-500' },
    { label: 'Allot Room', icon: FiUserPlus, path: '/admin/rooms', color: 'text-indigo-500' },
    { label: 'Add Room', icon: FiGrid, path: '/admin/rooms/new', color: 'text-emerald-500' },
    { label: 'Generate Fees', icon: FiDollarSign, path: '/admin/fees/generate', color: 'text-amber-500' },
    { label: 'Mark Attendance', icon: FiCalendar, path: '/admin/attendance/mark', color: 'text-purple-500' },
    { label: 'Post Notice', icon: FiBell, path: '/admin/notices/new', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="btn-secondary btn-sm gap-1.5"
          >
            <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
            {action.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatsCard key={stat.title} {...stat} delay={i} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Attendance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <AttendanceOverviewCard
            title="Student Attendance (This Month)"
            reportPath="/admin/attendance/report"
            take={8}
          />
        </motion.div>

        {/* Room Occupancy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Room Occupancy</h3>
            <span className="text-sm font-semibold text-brand-500">{data?.roomStats?.summary?.occupancyRate || 0}%</span>
          </div>
          <div className="flex items-center justify-center h-52">
            <div className="w-48"><Doughnut data={occupancyData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', size: 12 }, padding: 16 } } }, cutout: '65%' }} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Occupied', value: data?.roomStats?.summary?.occupiedRooms || 0, color: 'bg-brand-500' },
              { label: 'Available', value: data?.roomStats?.summary?.availableRooms || 0, color: 'bg-emerald-500' },
              { label: 'Maintenance', value: data?.roomStats?.summary?.maintenanceRooms || 0, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-1`} />
                <p className="text-lg font-bold text-surface-900 dark:text-white">{item.value}</p>
                <p className="text-[10px] text-surface-500">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fee Collection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Fee Collection</h3>
            <button onClick={() => navigate('/admin/fees')} className="text-xs text-brand-500 font-medium hover:text-brand-600 flex items-center gap-1">
              View All <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-64"><Bar data={feeData} options={chartOptions} /></div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: FiUsers, text: 'New student registered', time: '2 min ago', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
              { icon: FiDollarSign, text: 'Fee payment received ₹4,500', time: '1 hour ago', color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' },
              { icon: FiAlertCircle, text: 'New complaint: Plumbing Issue', time: '3 hours ago', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
              { icon: FiClipboard, text: 'Leave request approved', time: '5 hours ago', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
              { icon: FiBell, text: 'Notice posted: Exam Schedule', time: '1 day ago', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-700 dark:text-surface-300 truncate">{item.text}</p>
                  <p className="text-[10px] text-surface-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
