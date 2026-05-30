import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchComplaints } from '../../features/complaint/complaintSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { FiEye, FiAlertCircle } from 'react-icons/fi';

const ComplaintManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { complaints, loading } = useSelector((s) => s.complaint);

  useEffect(() => { dispatch(fetchComplaints({})); }, [dispatch]);

  const priorityBadge = { low: 'badge-info', medium: 'badge-warning', high: 'badge-danger', emergency: 'badge-danger' };
  const statusBadge = { pending: 'badge-warning', 'in-progress': 'badge-info', resolved: 'badge-success', closed: 'badge-neutral' };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints</h1>
          <p className="page-subtitle">View and manage student complaints</p>
        </div>
      </div>

      <div className="space-y-3">
        {complaints?.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FiAlertCircle className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
            <p className="text-surface-500">No complaints found</p>
          </div>
        ) : (
          complaints?.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-5 cursor-pointer" onClick={() => navigate(`/warden/complaints/${c._id}`)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${priorityBadge[c.priority] || 'badge-neutral'}`}>{c.priority}</span>
                    <span className={`badge ${statusBadge[c.status] || 'badge-neutral'}`}>{c.status}</span>
                  </div>
                  <h3 className="font-semibold text-surface-800 dark:text-surface-200 truncate">{c.title}</h3>
                  <p className="text-xs text-surface-500 mt-1">
                    {c.studentId?.userId?.name} • {c.category} • {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="btn-icon flex-shrink-0"><FiEye className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintManagement;
