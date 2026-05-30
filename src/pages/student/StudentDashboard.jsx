import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatsCard from '../../components/dashboard/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiDollarSign, FiCalendar, FiClipboard, FiMessageSquare, FiBell, FiGrid, FiArrowRight, FiPlus } from 'react-icons/fi';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const studentInfo = user?.studentInfo;

  const quickLinks = [
    { label: 'My Room', path: '/student/room', icon: FiGrid, desc: 'View room details', color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'My Fees', path: '/student/fees', icon: FiDollarSign, desc: 'View & pay fees', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Attendance', path: '/student/attendance', icon: FiCalendar, desc: 'Check attendance', color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Apply Leave', path: '/student/leaves/new', icon: FiClipboard, desc: 'Submit leave request', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'File Complaint', path: '/student/complaints/new', icon: FiMessageSquare, desc: 'Report an issue', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
    { label: 'Notices', path: '/student/notices', icon: FiBell, desc: 'View announcements', color: 'text-brand-500 bg-brand-100 dark:bg-brand-900/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 bg-gradient-to-r from-brand-500/10 to-purple-500/10 dark:from-brand-500/5 dark:to-purple-500/5">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          {studentInfo?.course} • Year {studentInfo?.year} • Semester {studentInfo?.semester}
          {studentInfo?.roomId && ` • Room ${studentInfo.roomId.block}-${studentInfo.roomId.roomNumber}`}
        </p>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link, i) => (
          <motion.button
            key={link.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(link.path)}
            className="glass-card-hover p-5 text-left flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${link.color}`}>
              <link.icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-surface-800 dark:text-surface-200">{link.label}</p>
              <p className="text-xs text-surface-500 mt-0.5">{link.desc}</p>
            </div>
            <FiArrowRight className="w-4 h-4 text-surface-400 flex-shrink-0" />
          </motion.button>
        ))}
      </div>

      {/* Student Info Card */}
      {studentInfo && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4">My Information</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Student ID', value: studentInfo.studentId },
              { label: 'Roll Number', value: studentInfo.rollNumber },
              { label: 'Course', value: studentInfo.course },
              { label: 'Branch', value: studentInfo.branch },
              { label: 'Year', value: studentInfo.year },
              { label: 'Semester', value: studentInfo.semester },
              { label: 'Status', value: studentInfo.status, badge: true },
              { label: 'Mess', value: studentInfo.messPreference, badge: true },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-surface-500 mb-0.5">{item.label}</p>
                {item.badge ? (
                  <span className="badge badge-brand capitalize">{item.value}</span>
                ) : (
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;
