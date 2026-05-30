import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStudents, deleteStudent } from '../../../features/student/studentSlice';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Pagination from '../../../components/common/Pagination';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEye, FiEdit2, FiTrash2, FiFilter, FiDownload } from 'react-icons/fi';

const StudentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, loading, pagination } = useSelector((s) => s.student);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents({ page, search, limit: 10 }));
  }, [dispatch, page, search]);

  const handleDelete = async () => {
    setDeleting(true);
    await dispatch(deleteStudent(deleteId));
    setDeleteId(null);
    setDeleting(false);
    dispatch(fetchStudents({ page, search, limit: 10 }));
  };

  const statusBadge = (status) => {
    const map = { active: 'badge-success', suspended: 'badge-danger', alumni: 'badge-info', left: 'badge-neutral' };
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage all registered hostel students</p>
        </div>
        <button onClick={() => navigate('/admin/students/new')} className="btn-primary">
          <FiPlus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID, roll number..."
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading && !students?.length ? (
        <LoadingSpinner />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="empty-state">
                        <p className="text-surface-500">No students found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students?.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                              {student.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-surface-900 dark:text-white text-sm">{student.userId?.name || 'N/A'}</p>
                            <p className="text-xs text-surface-500">{student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs">{student.rollNumber}</td>
                      <td>{student.course}</td>
                      <td>{student.year}</td>
                      <td>
                        {student.roomId ? (
                          <span className="badge badge-info">
                            {student.roomId.block}-{student.roomId.roomNumber}
                          </span>
                        ) : (
                          <span className="badge badge-neutral">Unassigned</span>
                        )}
                      </td>
                      <td>{statusBadge(student.status)}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate(`/admin/students/${student._id}`)} className="btn-icon" title="View">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button onClick={() => navigate(`/admin/students/${student._id}/edit`)} className="btn-icon" title="Edit">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteId(student._id)} className="btn-icon text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="p-4 border-t border-surface-200 dark:border-surface-700">
              <Pagination
                currentPage={page}
                totalPages={pagination.totalPages || Math.ceil((pagination.total || 0) / 10)}
                onPageChange={setPage}
              />
            </div>
          )}
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="This will permanently delete the student and their user account. This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
};

export default StudentList;