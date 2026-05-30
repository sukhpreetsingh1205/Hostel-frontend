import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  clearCurrentComplaint,
  fetchComplaintById,
  updateComplaintStatus,
} from '../../../features/complaint/complaintSlice';

const COMPLAINT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'closed', label: 'Closed' },
];

const statusColor = {
  pending: 'badge-warning',
  'in-progress': 'badge-info',
  resolved: 'badge-success',
  rejected: 'badge-danger',
  closed: 'badge-neutral',
};

const ComplaintDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentComplaint, loading, error } = useSelector((state) => state.complaint);
  const [status, setStatus] = useState('pending');
  const [remarks, setRemarks] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchComplaintById(id));
    return () => dispatch(clearCurrentComplaint());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentComplaint?.status) {
      setStatus(currentComplaint.status);
    }
  }, [currentComplaint]);

  const handleStatusUpdate = async () => {
    setSavingStatus(true);
    try {
      await dispatch(updateComplaintStatus({
        id,
        data: { status, remarks: remarks.trim() || undefined },
      })).unwrap();
      toast.success('Complaint status updated and student email sent if SMTP is configured');
      setRemarks('');
      dispatch(fetchComplaintById(id));
    } catch (err) {
      toast.error(err || 'Failed to update complaint status');
    } finally {
      setSavingStatus(false);
    }
  };

  const studentName = currentComplaint?.studentId?.userId?.name || currentComplaint?.studentId?.name || 'Student';
  const studentEmail = currentComplaint?.studentId?.userId?.email || currentComplaint?.studentId?.email || '-';
  const room = currentComplaint?.studentId?.roomId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Complaint Details</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">View complaint, change status, and notify student</p>
        </div>
        <Link to="/admin/complaints" className="btn-secondary btn-sm">
          Back
        </Link>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
        ) : !currentComplaint ? (
          <div className="text-surface-600 dark:text-surface-400">Complaint not found.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">{currentComplaint.title}</h2>
                  <span className={`badge ${statusColor[currentComplaint.status] || 'badge-neutral'} capitalize`}>
                    {currentComplaint.status}
                  </span>
                </div>
                <div className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  {currentComplaint.complaintId} - {currentComplaint.category} - {new Date(currentComplaint.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="min-w-full lg:min-w-[360px] rounded-lg border border-surface-200 dark:border-surface-700 p-4">
                <label className="input-label">Change Status</label>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="select-field">
                  {COMPLAINT_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <label className="input-label mt-3">Remarks for Student Email</label>
                <textarea
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Optional note about the status change"
                />
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={savingStatus || status === currentComplaint.status}
                  className="btn-primary mt-3 w-full"
                >
                  {savingStatus ? 'Updating...' : 'Update Status & Email Student'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-surface-500 dark:text-surface-400">Student</div>
                <div className="font-semibold text-surface-900 dark:text-surface-100">{studentName}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400">{studentEmail}</div>
              </div>
              <div>
                <div className="text-xs text-surface-500 dark:text-surface-400">Room</div>
                <div className="font-semibold text-surface-900 dark:text-surface-100">
                  {room ? `${room.block || ''}-${room.roomNumber}` : '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-surface-500 dark:text-surface-400">Priority</div>
                <div className="font-semibold text-surface-900 dark:text-surface-100 capitalize">{currentComplaint.priority}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Description</div>
              <div className="mt-1 text-surface-800 dark:text-surface-200">{currentComplaint.description || '-'}</div>
            </div>

            {currentComplaint.resolution?.description ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                <div className="text-xs font-semibold uppercase">Resolution</div>
                <div className="mt-1 text-sm">{currentComplaint.resolution.description}</div>
              </div>
            ) : null}

            {Array.isArray(currentComplaint.comments) && currentComplaint.comments.length ? (
              <div>
                <div className="text-xs text-surface-500 dark:text-surface-400">Comments</div>
                <div className="mt-2 space-y-2">
                  {currentComplaint.comments.map((comment, index) => (
                    <div key={index} className="border border-surface-200 dark:border-surface-700 rounded-lg p-3">
                      <div className="text-sm text-surface-800 dark:text-surface-200">{comment?.comment || comment?.text || ''}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                        {comment?.commentedBy?.name || 'Staff'} {comment?.commentedAt ? `- ${new Date(comment.commentedAt).toLocaleString()}` : ''}
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
