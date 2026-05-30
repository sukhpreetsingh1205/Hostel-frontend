import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
import StatsCard from '../../components/dashboard/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiUsers, FiGrid, FiClipboard, FiAlertCircle, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WardenDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector((s) => s.dashboard);

  useEffect(() => { dispatch(fetchDashboardData()); }, [dispatch]);

  if (loading && !data) return <LoadingSpinner />;

  const stats = [
    { title: 'Total Students', value: data?.studentStats?.total || 0, icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Total Rooms', value: data?.roomStats?.summary?.totalRooms || 0, icon: FiGrid, color: 'bg-emerald-500' },
  ];

  const quickLinks = [
    { label: 'Mark Attendance', path: '/warden/attendance', icon: FiCalendar, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Leave Requests', path: '/warden/leaves', icon: FiClipboard, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Complaints', path: '/warden/complaints', icon: FiAlertCircle, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
    { label: 'View Students', path: '/warden/students', icon: FiUsers, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'View Rooms', path: '/warden/rooms', icon: FiGrid, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Warden Dashboard</h1>
          <p className="page-subtitle">Overview of hostel operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, i) => <StatsCard key={stat.title} {...stat} delay={i} />)}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, i) => (
            <motion.button
              key={link.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(link.path)}
              className="glass-card-hover p-5 text-left flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.color}`}>
                <link.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-surface-800 dark:text-surface-200">{link.label}</p>
              </div>
              <FiArrowRight className="w-4 h-4 text-surface-400" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;