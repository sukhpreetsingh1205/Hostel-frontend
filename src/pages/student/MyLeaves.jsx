import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentLeaves, createLeave, cancelLeave } from '../../features/leave/leaveSlice';
import { FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const MyLeaves = () => {
  const dispatch = useDispatch();
  const { currentStudent } = useSelector((state) => state.student);
  const { leaves, stats } = useSelector((state) => state.leave);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'day_leave',
    fromDate: '',
    toDate: '',
    reason: '',
    destination: '',
    parentContact: '',
  });

  useEffect(() => {
    if (currentStudent?._id) {
      dispatch(fetchStudentLeaves(currentStudent._id));
    }
  }, [dispatch, currentStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createLeave(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Leave request submitted successfully');
      setShowForm(false);
      setFormData({
        type: 'day_leave',
        fromDate: '',
        toDate: '',
        reason: '',
        destination: '',
        parentContact: '',
      });
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      const result = await dispatch(cancelLeave(id));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Leave request cancelled');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leaves</h1>
          <p className="text-gray-600 mt-1">Apply for leave and track requests</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Leaves</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats?.approved || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats?.rejected || 0}</p>
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Leave History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {leaves?.map((leave) => (
            <div key={leave._id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                      {leave.type.replace('_', ' ')}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">From</p>
                      <p className="font-medium">{new Date(leave.fromDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To</p>
                      <p className="font-medium">{new Date(leave.toDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{leave.duration} days</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied On</p>
                      <p className="font-medium">{new Date(leave.appliedOn).toLocaleDateString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Reason</p>
                      <p className="font-medium">{leave.reason}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Destination</p>
                      <p className="font-medium">{leave.destination}</p>
                    </div>
                  </div>
                  {leave.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-md">
                      <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{leave.rejectionReason}</p>
                    </div>
                  )}
                </div>
                {leave.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(leave._id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Application Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="day_leave">Day Leave</option>
                  <option value="short_leave">Short Leave (4-8 hours)</option>
                  <option value="weekend_leave">Weekend Leave</option>
                  <option value="long_leave">Long Leave (&gt;3 days)</option>
                  <option value="emergency_leave">Emergency Leave</option>
                  <option value="medical_leave">Medical Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Where are you going?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Contact</label>
                <input
                  type="tel"
                  value={formData.parentContact}
                  onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="10-digit mobile number"
                  required
                  pattern="[0-9]{10}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Please provide detailed reason..."
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
