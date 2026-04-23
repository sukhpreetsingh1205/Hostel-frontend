import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchLeaveById, clearCurrentLeave } from '../../../features/leave/leaveSlice';

const LeaveDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentLeave, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    if (id) dispatch(fetchLeaveById(id));
    return () => dispatch(clearCurrentLeave());
  }, [dispatch, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Details</h1>
          <p className="text-gray-600 mt-1">View leave request information</p>
        </div>
        <Link to="/admin/leaves" className="btn btn-outline btn-sm">
          Back
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
        ) : !currentLeave ? (
          <div className="text-gray-600">Leave request not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500">Student</div>
              <div className="font-semibold text-gray-900">{currentLeave.studentId?.userId?.name || '—'}</div>
              <div className="text-sm text-gray-500">{currentLeave.studentId?.rollNumber || ''}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-semibold text-gray-900 capitalize">{currentLeave.status || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">From</div>
              <div className="font-semibold text-gray-900">
                {currentLeave.fromDate ? new Date(currentLeave.fromDate).toLocaleString() : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">To</div>
              <div className="font-semibold text-gray-900">
                {currentLeave.toDate ? new Date(currentLeave.toDate).toLocaleString() : '—'}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Reason</div>
              <div className="mt-1 text-gray-800">{currentLeave.reason || currentLeave.description || '—'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveDetails;
