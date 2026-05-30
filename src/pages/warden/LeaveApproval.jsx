import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaves, approveLeave, rejectLeave } from '../../features/leave/leaveSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LeaveApproval = () => {
  const dispatch = useDispatch();
  const { leaves, loading } = useSelector((s) => s.leave);
  const [filter, setFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => { dispatch(fetchLeaves({ status: filter })); }, [dispatch, filter]);

  const handleApprove = async (id) => {
    const result = await dispatch(approveLeave({ id, remarks: 'Approved by warden' }));
    if (!result.error) {
      toast.success('Leave approved');
      dispatch(fetchLeaves({ status: filter }));
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return toast.error('Please provide a reason');
    const result = await dispatch(rejectLeave({ id: rejectModal, rejectionReason }));
    if (!result.error) {
      toast.success('Leave rejected');
      setRejectModal(null);
      setRejectionReason('');
      dispatch(fetchLeaves({ status: filter }));
    }
  };

  const statusBadge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', cancelled: 'badge-neutral' };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Requests</h1>
          <p className="page-subtitle">Review and manage student leave applications</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['pending', 'approved', 'rejected', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f === 'all' ? '' : f)} className={`btn-sm rounded-xl font-medium transition-all capitalize ${(filter === f || (!filter && f === 'all')) ? 'bg-brand-500 text-white' : 'btn-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {leaves?.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-surface-500">No leave requests found</p>
            </div>
          ) : (
            leaves?.map((leave, i) => (
              <motion.div key={leave._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-surface-800 dark:text-surface-200 truncate">{leave.studentId?.userId?.name || 'Student'}</p>
                      <p className="text-xs text-surface-500">{leave.studentId?.rollNumber} • {leave.leaveId}</p>
                    </div>
                  </div>
                  <span className={`badge ${statusBadge[leave.status] || 'badge-neutral'}`}>{leave.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2"><FiCalendar className="w-3.5 h-3.5 text-surface-400" /><span className="text-surface-600 dark:text-surface-400">{new Date(leave.fromDate).toLocaleDateString()} — {new Date(leave.toDate).toLocaleDateString()}</span></div>
                  <div className="flex items-center gap-2"><FiMapPin className="w-3.5 h-3.5 text-surface-400" /><span className="text-surface-600 dark:text-surface-400">{leave.destination}</span></div>
                </div>
                <p className="mt-2 text-sm text-surface-600 dark:text-surface-400"><span className="font-medium">Reason:</span> {leave.reason}</p>
                {leave.status === 'pending' && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-surface-200 dark:border-surface-700">
                    <button onClick={() => handleApprove(leave._id)} className="btn-primary btn-sm"><FiCheck className="w-3.5 h-3.5" /> Approve</button>
                    <button onClick={() => setRejectModal(leave._id)} className="btn-danger btn-sm"><FiX className="w-3.5 h-3.5" /> Reject</button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <div className="modal-overlay" onClick={() => setRejectModal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="modal-content">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Rejection Reason</h3>
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="input-field" rows="3" placeholder="Please provide a reason for rejection..." />
              <div className="flex gap-3 mt-4 justify-end">
                <button onClick={() => setRejectModal(null)} className="btn-secondary">Cancel</button>
                <button onClick={handleReject} className="btn-danger">Reject Leave</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveApproval;