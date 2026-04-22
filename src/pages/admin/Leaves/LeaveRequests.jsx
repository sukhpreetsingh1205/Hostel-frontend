import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves, approveLeave, rejectLeave } from '../../../features/leave/leaveSlice';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const LeaveRequests = () => {
  const dispatch = useDispatch();
  const { leaves, loading } = useSelector((state) => state.leave);
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    dispatch(fetchLeaves({ status: filterStatus }));
  }, [dispatch, filterStatus]);

  const handleApprove = async (id) => {
    const result = await dispatch(approveLeave({ id, remarks: 'Approved by warden' }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Leave request approved');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      const result = await dispatch(rejectLeave({ id, rejectionReason: reason }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Leave request rejected');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-gray-600 mt-1">Manage student leave applications</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-2">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md capitalize ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leaves.map((leave) => (
            <div key={leave._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{leave.studentId?.userId?.name}</h3>
                    <p className="text-sm text-gray-500">{leave.studentId?.rollNumber}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Leave Type</p>
                    <p className="font-medium capitalize">{leave.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">{leave.duration} days</p>
                  </div>
                  <div>
                    <p className="text-gray-500">From Date</p>
                    <p className="font-medium">{new Date(leave.fromDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">To Date</p>
                    <p className="font-medium">{new Date(leave.toDate).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Reason</p>
                    <p className="font-medium">{leave.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Destination</p>
                    <p className="font-medium">{leave.destination}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Parent Contact</p>
                    <p className="font-medium">{leave.parentContact}</p>
                  </div>
                </div>

                {leave.status === 'pending' && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleReject(leave._id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <FiX className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(leave._id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <FiCheck className="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}

                {leave.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                    <p className="text-sm text-red-700">{leave.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;