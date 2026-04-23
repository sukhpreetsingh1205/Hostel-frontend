import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchComplaintById, clearCurrentComplaint } from '../../../features/complaint/complaintSlice';

const ComplaintDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentComplaint, loading, error } = useSelector((state) => state.complaint);

  useEffect(() => {
    if (id) dispatch(fetchComplaintById(id));
    return () => dispatch(clearCurrentComplaint());
  }, [dispatch, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
          <p className="text-gray-600 mt-1">View complaint and comments</p>
        </div>
        <Link to="/admin/complaints" className="btn btn-outline btn-sm">
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
        ) : !currentComplaint ? (
          <div className="text-gray-600">Complaint not found.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-bold text-gray-900">{currentComplaint.title}</div>
                <div className="text-sm text-gray-500">
                  {currentComplaint.category} • {new Date(currentComplaint.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="badge badge-outline capitalize">{currentComplaint.status}</span>
            </div>

            <div>
              <div className="text-xs text-gray-500">Description</div>
              <div className="mt-1 text-gray-800">{currentComplaint.description || '—'}</div>
            </div>

            {Array.isArray(currentComplaint.comments) && currentComplaint.comments.length ? (
              <div>
                <div className="text-xs text-gray-500">Comments</div>
                <div className="mt-2 space-y-2">
                  {currentComplaint.comments.map((c, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="text-sm text-gray-800">{c?.comment || c?.text || ''}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {c?.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetails;
