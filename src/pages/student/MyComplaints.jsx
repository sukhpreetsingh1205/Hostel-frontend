import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentComplaints } from '../../features/complaint/complaintSlice';

const MyComplaints = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { complaints, loading } = useSelector((state) => state.complaint);

  useEffect(() => {
    if (user?.studentInfo?._id) {
      dispatch(fetchStudentComplaints(user.studentInfo._id));
    }
  }, [dispatch, user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <p className="text-gray-600 mt-1">Track your raised complaints and their status</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : complaints?.length ? (
          <div className="divide-y">
            {complaints.map((c) => (
              <div key={c._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{c.title}</div>
                    <div className="text-sm text-gray-500">{c.category}</div>
                  </div>
                  <span className="badge badge-outline">{c.status}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{c.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-gray-600">No complaints yet.</div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
