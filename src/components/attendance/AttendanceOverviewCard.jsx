import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { attendanceApi } from '../../api/attendanceApi';

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const AttendanceOverviewCard = ({ reportPath, title = 'Student Attendance', take = 6 }) => {
  const now = useMemo(() => new Date(), []);
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthLabel = now.toLocaleString('default', { month: 'long' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await attendanceApi.getStats({ month, year });
      setSummary(response.data?.summary || null);
      setRows(response.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load attendance');
      setSummary(null);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    load();
  }, [load]);

  const topRows = useMemo(() => (Array.isArray(rows) ? rows.slice(0, take) : []), [rows, take]);

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">{title}</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            {monthLabel} {year}
            {summary ? ` • Avg ${formatPercent(summary.averageAttendance)}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="btn-icon" title="Refresh" type="button">
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to={reportPath} className="btn-secondary btn-sm">
            View Report <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {topRows.map((row) => (
                <tr key={row.studentId}>
                  <td className="font-medium text-surface-900 dark:text-surface-100">{row.name || '—'}</td>
                  <td className="font-mono text-xs">{row.rollNumber || '—'}</td>
                  <td>
                    <span className={Number(row.percentage) < 75 ? 'badge badge-danger' : 'badge badge-brand'}>
                      {formatPercent(row.percentage)}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !topRows.length ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm text-surface-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {summary ? (
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-4">
          Below 75%: {summary.studentsBelow75 ?? 0}
        </p>
      ) : null}
    </div>
  );
};

export default AttendanceOverviewCard;

