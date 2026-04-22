import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentFees } from '../../features/fee/feeSlice';
import { fetchStudentAttendance } from '../../features/attendance/attendanceSlice';
import { fetchStudentLeaves } from '../../features/leave/leaveSlice';
import { fetchStudentComplaints } from '../../features/complaint/complaintSlice';
import { FaUser, FaBed, FaMoneyBillWave, FaCalendarCheck, FaClipboardList, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { studentFees } = useSelector((state) => state.fee);
  const { attendance } = useSelector((state) => state.attendance);
  const { leaves } = useSelector((state) => state.leave);
  const { complaints } = useSelector((state) => state.complaint);
  const { activeNotices } = useSelector((state) => state.notice);

  useEffect(() => {
    // Fetch student data
    if (user?.studentInfo?._id) {
      dispatch(fetchStudentFees(user.studentInfo._id));
      dispatch(fetchStudentAttendance(user.studentInfo._id));
      dispatch(fetchStudentLeaves(user.studentInfo._id));
      dispatch(fetchStudentComplaints(user.studentInfo._id));
    }
  }, [dispatch, user]);

  const quickStats = [
    {
      title: 'Room Number',
      value: user?.studentInfo?.roomId?.roomNumber || 'Not Allotted',
      icon: FaBed,
      color: 'bg-blue-500',
      link: '/student/room',
    },
    {
      title: 'Total Fees Due',
      value: `₹${studentFees?.summary?.totalDue?.toLocaleString() || 0}`,
      icon: FaMoneyBillWave,
      color: 'bg-yellow-500',
      link: '/student/fees',
    },
    {
      title: 'Attendance',
      value: `${attendance?.summary?.percentage || 0}%`,
      icon: FaCalendarCheck,
      color: 'bg-green-500',
      link: '/student/attendance',
    },
    {
      title: 'Pending Leaves',
      value: leaves?.stats?.pending || 0,
      icon: FaClipboardList,
      color: 'bg-purple-500',
      link: '/student/leaves',
    },
  ];

  const quickActions = [
    { name: 'Pay Fees', icon: FaMoneyBillWave, link: '/student/fees', color: 'bg-green-500' },
    { name: 'Request Leave', icon: FaClipboardList, link: '/student/leaves/new', color: 'bg-blue-500' },
    { name: 'Raise Complaint', icon: FaBell, link: '/student/complaints/new', color: 'bg-red-500' },
    { name: 'View Profile', icon: FaUser, link: '/student/profile', color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 opacity-90">
          {user?.studentInfo?.course} - Year {user?.studentInfo?.year} | Roll No: {user?.studentInfo?.rollNumber}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Link to={stat.link} key={index}>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className={`${action.color} p-3 rounded-full mb-2`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Notices</h2>
          <div className="space-y-3">
            {activeNotices?.slice(0, 3).map((notice, index) => (
              <div key={index} className="border-b border-gray-100 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{notice.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{notice.summary}</p>
                  </div>
                  {notice.priority === 'high' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <Link to="/student/notices" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 block">
            View all notices →
          </Link>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>
          <div className="space-y-3">
            {complaints?.slice(0, 3).map((complaint, index) => (
              <div key={index} className="border-b border-gray-100 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{complaint.category}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          <Link to="/student/complaints" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 block">
            View all complaints →
          </Link>
        </div>
      </div>

      {/* Fee Status */}
      {studentFees?.summary?.totalDue > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Fee Payment Reminder</h3>
              <p className="text-yellow-700 mt-1">
                You have a pending fee of ₹{studentFees.summary.totalDue}. Please pay before the due date to avoid late fees.
              </p>
            </div>
            <Link
              to="/student/fees"
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Pay Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;