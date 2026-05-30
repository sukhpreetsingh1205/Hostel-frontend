import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchComplaints } from '../../features/complaint/complaintSlice';
import { FiEye } from 'react-icons/fi';

const Complaints = () => {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.complaint);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    dispatch(fetchComplaints({ status: filterStatus, priority: filterPriority }));
  }, [dispatch, filterStatus, filterPriority]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
        <p className="text-gray-600 mt-1">Review and resolve student complaints</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{complaint.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {complaint.category} • {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{complaint.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>Student: {complaint.studentId?.userId?.name || '—'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Room: {complaint.studentId?.roomId?.roomNumber || '—'}</span>
                  </div>
                </div>

                <Link to={`/warden/complaints/${complaint._id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <FiEye className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}

          {complaints.length === 0 ? <div className="text-gray-600">No complaints found.</div> : null}
        </div>
      )}
    </div>
  );
};

export default Complaints;

