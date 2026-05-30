import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiEye, FiSearch, FiX } from 'react-icons/fi';
import { attendanceApi } from '../../api/attendanceApi';
import LoadingSpinner from '../common/LoadingSpinner';

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const statusToClasses = (status) => {
  switch (status) {
    case 'present':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-900/40';
    case 'absent':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900/40';
    case 'late':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-900/40';
    case 'leave':
      return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-900/40';
    case 'holiday':
      return 'bg-surface-100 text-surface-600 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700';
    default:
      return 'bg-surface-50 text-surface-600 border-surface-200 dark:bg-surface-900/40 dark:text-surface-300 dark:border-surface-800';
  }
};

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const AttendanceDetailsModal = ({ open, onClose, student, month, year }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);

  const load = useCallback(async () => {
    if (!open || !student?._id) return;
    setLoading(true);
    setError('');

    try {
      const response = await attendanceApi.getStudentAttendance(student._id, { month, year });
      setRecords(response.data?.data || []);
      setSummary(response.data?.summary || null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
      setRecords([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [open, student?._id, month, year]);

  useEffect(() => {
    load();
  }, [load]);

  const statusByDay = useMemo(() => {
    const map = {};
    (records || []).forEach((record) => {
      const date = new Date(record.date);
      if (Number.isNaN(date.getTime())) return;
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month) return;
      map[date.getDate()] = record.status;
    });
    return map;
  }, [records, month, year]);

  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [month, year]);
  const firstDayIndex = useMemo(() => new Date(year, month - 1, 1).getDay(), [month, year]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-content max-w-4xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white truncate">
                Attendance • {student?.name || 'Student'}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {months.find((m) => m.value === month)?.label} {year}
                {student?.rollNumber ? ` • ${student.rollNumber}` : ''}
              </p>
            </div>
            <button onClick={onClose} className="btn-icon">
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading attendance..." />
          ) : error ? (
            <div className="mt-6 glass-card p-4 border border-red-200/60 dark:border-red-900/40">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="glass-card p-4">
                  <p className="text-xs text-surface-500">Percentage</p>
                  <p className="text-xl font-bold text-surface-900 dark:text-white">{formatPercent(summary?.percentage || 0)}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-surface-500">Present</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{summary?.present || 0}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-surface-500">Absent</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">{summary?.absent || 0}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-surface-500">Leave</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{summary?.leave || 0}</p>
                </div>
              </div>

              <div className="glass-card p-5">
                <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Calendar</h4>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                    <div key={label} className="text-[10px] font-semibold text-surface-500 py-2">
                      {label}
                    </div>
                  ))}

                  {Array.from({ length: firstDayIndex }).map((_, idx) => (
                    <div key={`blank-${idx}`} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const status = statusByDay[day];
                    return (
                      <div
                        key={day}
                        className={`border rounded-xl p-2 min-h-16 flex flex-col items-center justify-center ${statusToClasses(status)}`}
                      >
                        <div className="text-sm font-bold">{day}</div>
                        <div className="text-[10px] uppercase tracking-wide mt-1">
                          {status || '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AttendanceReportPanel = ({ roleBasePath = '/admin', title = 'Attendance Report' }) => {
  const now = useMemo(() => new Date(), []);
  const currentYear = now.getFullYear();
  const years = useMemo(() => Array.from({ length: 6 }, (_, i) => currentYear - i), [currentYear]);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [course, setCourse] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [onlyBelow75, setOnlyBelow75] = useState(false);
  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        month,
        year,
        course: course || undefined,
        studentYear: yearOfStudy || undefined,
      };
      const response = await attendanceApi.getStats(params);
      setSummary(response.data?.summary || null);
      setRows(response.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance report');
      setSummary(null);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [month, year, course, yearOfStudy]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = Array.isArray(rows) ? rows : [];

    if (onlyBelow75) next = next.filter((r) => Number(r?.percentage) < 75);

    if (!q) return next;

    return next.filter((row) => {
      const name = String(row?.name || '').toLowerCase();
      const roll = String(row?.rollNumber || '').toLowerCase();
      return name.includes(q) || roll.includes(q);
    });
  }, [rows, query, onlyBelow75]);

  const selectedMonthLabel = months.find((m) => m.value === month)?.label || '';

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">View attendance per student for {selectedMonthLabel} {year}.</p>
        </div>
        <button onClick={load} className="btn-secondary">
          Refresh
        </button>
      </div>

      <div className="glass-card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div>
            <label className="input-label">Month</label>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="select-field">
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Year</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="select-field">
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Course</label>
            <input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="input-field"
              placeholder="e.g. B.Tech"
            />
          </div>
          <div>
            <label className="input-label">Year Of Study</label>
            <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="select-field">
              <option value="">All</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={String(value)}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Search</label>
            <div className="relative">
              <FiSearch className="w-4 h-4 text-surface-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-11"
                placeholder="Name or roll no."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
            <input
              type="checkbox"
              checked={onlyBelow75}
              onChange={(e) => setOnlyBelow75(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Show only below 75%
          </label>
          <div className="text-xs text-surface-500">
            Showing {filteredRows.length} students
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500">Students (with records)</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-2">{summary?.totalStudents ?? 0}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500">Average Attendance</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-2">{formatPercent(summary?.averageAttendance ?? 0)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-surface-500">Below 75%</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-2">{summary?.studentsBelow75 ?? 0}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading report..." />
        ) : error ? (
          <div className="p-5">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : filteredRows.length ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Late</th>
                  <th>Leave</th>
                  <th>Total</th>
                  <th>%</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.studentId}>
                    <td className="font-medium text-surface-900 dark:text-surface-100">{row.name || '—'}</td>
                    <td className="font-mono text-xs">{row.rollNumber || '—'}</td>
                    <td>{row.present ?? 0}</td>
                    <td>{row.absent ?? 0}</td>
                    <td>{row.late ?? 0}</td>
                    <td>{row.leave ?? 0}</td>
                    <td>{row.total ?? 0}</td>
                    <td>
                      <span className={Number(row.percentage) < 75 ? 'badge badge-danger' : 'badge badge-brand'}>
                        {formatPercent(row.percentage)}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDetailsStudent({ _id: row.studentId, name: row.name, rollNumber: row.rollNumber });
                            setDetailsOpen(true);
                          }}
                          className="btn-secondary btn-sm"
                        >
                          <FiEye className="w-3.5 h-3.5" /> View
                        </button>
                        <Link to={`${roleBasePath}/students/${row.studentId}`} className="btn-ghost btn-sm">
                          Student <FiArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 empty-state">
            <p className="text-sm text-surface-500">No attendance records found for selected filters.</p>
          </div>
        )}
      </div>

      <AttendanceDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        student={detailsStudent}
        month={month}
        year={year}
      />
    </div>
  );
};

export default AttendanceReportPanel;

