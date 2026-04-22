import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
import StatsCard from '../../components/dashboard/StatsCard';
import { 
  FaUsers, 
  FaBed, 
  FaMoneyBillWave, 
  FaCalendarCheck,
  FaExclamationTriangle,
  FaChartLine 
} from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dashboard);
  const { stats: feeStats } = useSelector((state) => state.fee);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: data?.studentStats?.total || 0,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Total Rooms',
      value: data?.roomStats?.summary?.totalRooms || 0,
      icon: FaBed,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: 'Monthly Collection',
      value: `₹${feeStats?.monthlyCollection?.[0]?.totalCollected?.toLocaleString() || 0}`,
      icon: FaMoneyBillWave,
      color: 'bg-yellow-500',
      change: '+18%',
    },
    {
      title: 'Today\'s Attendance',
      value: `${data?.todayAttendance?.markedCount || 0}/${data?.todayAttendance?.totalStudents || 0}`,
      icon: FaCalendarCheck,
      color: 'bg-purple-500',
      change: `${((data?.todayAttendance?.markedCount / data?.todayAttendance?.totalStudents) * 100).toFixed(1)}%`,
    },
  ];

  const occupancyData = {
    labels: ['Occupied', 'Available', 'Maintenance'],
    datasets: [
      {
        data: [
          data?.roomStats?.summary?.occupiedRooms || 0,
          data?.roomStats?.summary?.availableRooms || 0,
          data?.roomStats?.summary?.maintenanceRooms || 0,
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [85, 88, 92, 87, 90, 78, 65],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Absent',
        data: [15, 12, 8, 13, 10, 22, 35],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const feeCollectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Collection (₹)',
        data: [85000, 92000, 88000, 95000, 91000, 98000],
        backgroundColor: '#10B981',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="btn btn-primary">Download Report</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Attendance Trend</h3>
          <Line data={attendanceData} options={{ responsive: true }} />
        </div>

        {/* Room Occupancy */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Room Occupancy Distribution</h3>
          <div className="flex justify-center">
            <div className="w-64">
              <Doughnut data={occupancyData} options={{ responsive: true }} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Occupancy Rate:</span>
              <span className="font-semibold">{data?.roomStats?.summary?.occupancyRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Total Capacity:</span>
              <span className="font-semibold">
                {data?.roomStats?.byType?.reduce((sum, t) => sum + t.totalCapacity, 0) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Fee Collection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Fee Collection Trend</h3>
          <Bar data={feeCollectionData} options={{ responsive: true }} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <FaUsers className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New student registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <FaMoneyBillWave className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Fee payment received</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <FaExclamationTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New complaint filed</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Defaulters Alert */}
      {feeStats?.topDefaulters?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3">Fee Defaulters Alert</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-red-700">
                  <th className="pb-2">Student Name</th>
                  <th className="pb-2">Roll Number</th>
                  <th className="pb-2">Due Amount</th>
                  <th className="pb-2">Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {feeStats.topDefaulters.map((defaulter, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-2">{defaulter.studentId?.userId?.name}</td>
                    <td className="py-2">{defaulter.studentId?.rollNumber}</td>
                    <td className="py-2">₹{defaulter.balance}</td>
                    <td className="py-2">
                      {Math.ceil((new Date() - new Date(defaulter.dueDate)) / (1000 * 60 * 60 * 24))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;