import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../features/student/studentSlice';
import { markAttendance } from '../../features/attendence/attendanceSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateInputValue } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiClock, FiSave } from 'react-icons/fi';

const AttendanceMarking = () => {
  const dispatch = useDispatch();
  const { students, loading: studentsLoading } = useSelector((s) => s.student);
  const { loading: saving } = useSelector((s) => s.attendance);
  const [date, setDate] = useState(() => formatDateInputValue(new Date()));
  const [records, setRecords] = useState({});

  useEffect(() => { dispatch(fetchStudents({ status: 'active', limit: 1000 })); }, [dispatch]);

  useEffect(() => {
    if (students?.length) {
      const initial = {};
      students.forEach((s) => { initial[s._id] = 'present'; });
      setRecords(initial);
    }
  }, [students]);

  const setStatus = (studentId, status) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students?.forEach((s) => { updated[s._id] = status; });
    setRecords(updated);
  };

  const handleSubmit = async () => {
    const recordsArray = Object.entries(records).map(([studentId, status]) => ({ studentId, status }));
    const result = await dispatch(markAttendance({ date, records: recordsArray }));
    if (!result.error) toast.success(`Attendance marked for ${recordsArray.length} students`);
  };

  const statusBtn = (studentId, status, icon, label, color) => (
    <button
      type="button"
      onClick={() => setStatus(studentId, status)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        records[studentId] === status ? `${color} text-white shadow-sm` : 'bg-surface-100 dark:bg-surface-800 text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700'
      }`}
    >
      {icon} {label}
    </button>
  );

  if (studentsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mark Attendance</h1>
          <p className="page-subtitle">Record daily student attendance</p>
        </div>
      </div>

      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div>
          <label className="input-label">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field w-48" />
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button type="button" onClick={() => markAll('present')} className="btn-secondary btn-sm">All Present</button>
          <button type="button" onClick={() => markAll('absent')} className="btn-secondary btn-sm">All Absent</button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Student</th><th>Roll No.</th><th>Room</th><th>Status</th></tr>
            </thead>
            <tbody>
              {students?.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{student.userId?.name?.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-surface-800 dark:text-surface-200">{student.userId?.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{student.rollNumber}</td>
                  <td>{student.roomId ? `${student.roomId.block}-${student.roomId.roomNumber}` : '-'}</td>
                  <td>
                    <div className="flex gap-1.5">
                      {statusBtn(student._id, 'present', <FiCheck className="w-3 h-3" />, 'Present', 'bg-emerald-500')}
                      {statusBtn(student._id, 'absent', <FiX className="w-3 h-3" />, 'Absent', 'bg-red-500')}
                      {statusBtn(student._id, 'late', <FiClock className="w-3 h-3" />, 'Late', 'bg-amber-500')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={saving} className="btn-primary">
          <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendanceMarking;
