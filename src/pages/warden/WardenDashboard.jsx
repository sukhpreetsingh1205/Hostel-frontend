import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
import { fetchPendingLeaves } from '../../features/leave/leaveSlice';
import { fetchComplaints } from '../../features/complaint/complaintSlice';
import { FaBed, FaUsers, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';

const WardenDashboard = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dashboard);
  const { leaves } = useSelector((state) => state.leave);
  const { complaints } = useSelector((state) => state.complaint);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchPendingLeaves());
    dispatch(fetchComplaints({ status: 'pending' }));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Students',
      value: data?.studentStats?.total || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      link: '/warden/students',
    },
    {
      title: 'Total Rooms',
      value: data?.roomStats?.summary?.totalRooms || 0,
      icon: FaBed,
      color: 'bg-green-500',
      link: '/warden/rooms',
    },
    {
      title: 'Pending Leaves',
      value: leaves?.filter(l => l.status === 'pending').length || 0,
      icon: FaClipboardList,
      color: 'bg-yellow-500',
      link: '/warden/leaves',
    },
    {
      title: 'Pending Complaints',
      value: complaints?.filter(c => c.status === 'pending').length || 0,
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      link: '/warden/complaints',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warden Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of hostel activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link}>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/warden/attendance"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-indigo-600 mb-2">
            <FaClipboardList className="h-8 w-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900">Mark Attendance</h3>
          <p className="text-sm text-gray-500 mt-1">Mark daily attendance</p>
        </Link>
        <Link
          to="/warden/leaves"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-yellow-600 mb-2">
            <FaClipboardList className="h-8 w-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900">Leave Approvals</h3>
          <p className="text-sm text-gray-500 mt-1">Review leave requests</p>
        </Link>
        <Link
          to="/warden/complaints"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-red-600 mb-2">
            <FaExclamationTriangle className="h-8 w-8 mx-auto" />
          </div>
          <h3 className="font-semibold text-gray-900">Complaints</h3>
          <p className="text-sm text-gray-500 mt-1">Manage complaints</p>
        </Link>
      </div>
    </div>
  );
};

export default WardenDashboard;