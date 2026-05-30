import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiClipboard,
  FiDownload,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiRefreshCw,
  FiUsers,
} from 'react-icons/fi';
import { studentApi } from '../../api/studentApi';
import { roomApi } from '../../api/roomApi';
import { feeApi } from '../../api/feeApi';
import { leaveApi } from '../../api/leaveApi';
import { attendanceApi } from '../../api/attendanceApi';
import { complaintApi } from '../../api/complaintApi';
import { noticeApi } from '../../api/noticeApi';

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

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

const getData = (response) => response?.data?.data ?? response?.data ?? {};
const getCount = (items, key) => items?.find((item) => item._id === key)?.count || 0;
const getTotal = (items, field) => items?.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) || 0;
const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatMoney = (value) => `Rs. ${formatNumber(value)}`;
const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const downloadCsv = (filename, rows) => {
  const csvRows = rows.map((row) =>
    row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
  );
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const StatCard = ({ title, value, subtitle, icon: Icon, tone = 'brand', error }) => {
  const toneMap = {
    brand: 'text-brand-500 bg-brand-100 dark:bg-brand-900/30',
    blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
    amber: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    red: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    purple: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</p>
          {error ? (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : (
            <>
              <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
              {subtitle ? <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">{subtitle}</p> : null}
            </>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneMap[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const BreakdownCard = ({ title, items, labelKey = '_id', valueKey = 'count', emptyText = 'No data available' }) => {
  const max = Math.max(...(items || []).map((item) => Number(item[valueKey]) || 0), 1);

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">{title}</h2>
      {items?.length ? (
        <div className="space-y-3">
          {items.map((item) => {
            const value = Number(item[valueKey]) || 0;
            return (
              <div key={`${item[labelKey]}-${value}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">{item[labelKey] || 'Unknown'}</span>
                  <span className="text-surface-500 dark:text-surface-400">{formatNumber(value)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(value / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-surface-500 dark:text-surface-400">{emptyText}</p>
      )}
    </div>
  );
};

const DataTable = ({ title, columns, rows, emptyText = 'No records found' }) => (
  <div className="glass-card overflow-hidden">
    <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700">
      <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{title}</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.length ? (
            rows.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center text-surface-500 dark:text-surface-400">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({
    month: currentDate.getMonth() + 1,
    year: currentYear,
  });
  const [stats, setStats] = useState({
    students: null,
    rooms: null,
    fees: null,
    leaves: null,
    attendance: null,
    attendanceToday: null,
    complaints: null,
    notices: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setErrors({});

    const results = await Promise.allSettled([
      studentApi.getStats(),
      roomApi.getStats(),
      feeApi.getStats(),
      leaveApi.getStats(),
      attendanceApi.getStats({ month: filters.month, year: filters.year }),
      attendanceApi.getTodaySummary(),
      complaintApi.getStats(),
      noticeApi.getStats(),
    ]);

    const keys = ['students', 'rooms', 'fees', 'leaves', 'attendance', 'attendanceToday', 'complaints', 'notices'];
    const labels = ['Student report', 'Room report', 'Fee report', 'Leave report', 'Attendance report', 'Today attendance', 'Complaint report', 'Notice report'];
    const nextStats = {};
    const nextErrors = {};

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        nextStats[keys[index]] = getData(result.value);
      } else {
        nextStats[keys[index]] = null;
        nextErrors[keys[index]] = result.reason?.response?.data?.message || `${labels[index]} failed`;
      }
    });

    setStats(nextStats);
    setErrors(nextErrors);
    setLoading(false);
  }, [filters.month, filters.year]);

  useEffect(() => {
    load();
  }, [load]);

  const report = useMemo(() => {
    const feeSummary = stats.fees?.summary || [];
    const totalFeeAmount = getTotal(feeSummary, 'totalAmount');
    const totalPaid = getTotal(feeSummary, 'totalPaid');
    const totalDue = getTotal(feeSummary, 'totalDue');
    const paidFeeRecords = getCount(feeSummary, 'paid');
    const pendingFeeRecords = getCount(feeSummary, 'pending') + getCount(feeSummary, 'partial');
    const overdueFeeRecords = getCount(feeSummary, 'overdue');
    const attendanceSummary = stats.attendance?.summary || {};
    const todaySummary = stats.attendanceToday || {};
    const presentToday = todaySummary.summary?.present || 0;
    const markedToday = todaySummary.markedCount || 0;
    const totalStudentsToday = todaySummary.totalStudents || 0;
    const complaintOpen = stats.complaints?.unresolvedCount || 0;
    const leavesPending = getCount(stats.leaves?.statusStats, 'pending');
    const roomsSummary = stats.rooms?.summary || {};
    const occupancyRate = Number(roomsSummary.occupancyRate || 0);

    return {
      totalFeeAmount,
      totalPaid,
      totalDue,
      paidFeeRecords,
      pendingFeeRecords,
      overdueFeeRecords,
      averageAttendance: Number(attendanceSummary.averageAttendance || 0),
      studentsBelow75: attendanceSummary.studentsBelow75 || 0,
      presentToday,
      markedToday,
      totalStudentsToday,
      todayCompletion: totalStudentsToday ? (markedToday / totalStudentsToday) * 100 : 0,
      complaintOpen,
      leavesPending,
      occupancyRate,
    };
  }, [stats]);

  const exportRows = useMemo(() => [
    ['Metric', 'Value'],
    ['Total Students', stats.students?.total || 0],
    ['Active Students', stats.students?.active || 0],
    ['Total Rooms', stats.rooms?.summary?.totalRooms || 0],
    ['Room Occupancy Rate', formatPercent(report.occupancyRate)],
    ['Total Fee Amount', report.totalFeeAmount],
    ['Total Fee Paid', report.totalPaid],
    ['Total Fee Due', report.totalDue],
    ['Average Attendance', formatPercent(report.averageAttendance)],
    ['Students Below 75 Attendance', report.studentsBelow75],
    ['Pending Leaves', report.leavesPending],
    ['Open Complaints', report.complaintOpen],
    ['Active Notices', stats.notices?.summary?.active || 0],
  ], [report, stats]);

  const handleExport = () => {
    downloadCsv(`hostel-report-${filters.month}-${filters.year}.csv`, exportRows);
  };

  const studentCourseRows = (stats.students?.byCourse || []).map((item) => ({
    course: item._id?.course || 'Unknown',
    year: item._id?.year || '-',
    count: item.count,
  }));

  const monthlyFeeRows = (stats.fees?.monthlyCollection || []).slice(0, 8).map((item) => ({
    month: `${item._id?.month}/${item._id?.year}`,
    collected: item.totalCollected,
    due: item.totalDue,
    pending: item.totalPending,
    overdue: item.totalOverdue,
  }));

  const lowAttendanceRows = (stats.attendance?.data || []).slice(0, 8).map((student) => ({
    name: student.name,
    rollNumber: student.rollNumber,
    percentage: student.percentage,
    present: student.present,
    total: student.total,
  }));

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Hostel performance, finance, attendance, and operations in one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.month}
            onChange={(event) => setFilters((prev) => ({ ...prev, month: Number(event.target.value) }))}
            className="select-field w-36"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={filters.year}
            onChange={(event) => setFilters((prev) => ({ ...prev, year: Number(event.target.value) }))}
            className="select-field w-28"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button type="button" className="btn-secondary" onClick={load} disabled={loading}>
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button type="button" className="btn-primary" onClick={handleExport}>
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Students" value={formatNumber(stats.students?.total)} subtitle={`${formatNumber(stats.students?.active)} active`} icon={FiUsers} tone="blue" error={errors.students} />
        <StatCard title="Room Occupancy" value={formatPercent(report.occupancyRate)} subtitle={`${formatNumber(stats.rooms?.summary?.availableRooms)} rooms available`} icon={FiGrid} tone="green" error={errors.rooms} />
        <StatCard title="Fee Collection" value={formatMoney(report.totalPaid)} subtitle={`${formatMoney(report.totalDue)} due`} icon={FiDollarSign} tone="amber" error={errors.fees} />
        <StatCard title="Attendance Average" value={formatPercent(report.averageAttendance)} subtitle={`${formatNumber(report.studentsBelow75)} students below 75%`} icon={FiCalendar} tone="purple" error={errors.attendance} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Today's Marking" value={formatPercent(report.todayCompletion)} subtitle={`${formatNumber(report.markedToday)} of ${formatNumber(report.totalStudentsToday)} students marked`} icon={FiBarChart2} tone="brand" error={errors.attendanceToday} />
        <StatCard title="Pending Leaves" value={formatNumber(report.leavesPending)} subtitle="Requests awaiting action" icon={FiClipboard} tone="amber" error={errors.leaves} />
        <StatCard title="Open Complaints" value={formatNumber(report.complaintOpen)} subtitle="Pending or in progress" icon={FiAlertCircle} tone="red" error={errors.complaints} />
        <StatCard title="Active Notices" value={formatNumber(stats.notices?.summary?.active)} subtitle={`${formatNumber(stats.notices?.summary?.total)} total notices`} icon={FiFileText} tone="blue" error={errors.notices} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <BreakdownCard title="Room Occupancy By Type" items={stats.rooms?.byType || []} labelKey="type" valueKey="currentOccupancy" />
        <BreakdownCard title="Leave Status" items={stats.leaves?.statusStats || []} />
        <BreakdownCard title="Complaint Priority" items={stats.complaints?.priorityStats || []} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DataTable
          title="Student Strength By Course"
          columns={[
            { key: 'course', label: 'Course' },
            { key: 'year', label: 'Year' },
            { key: 'count', label: 'Students', render: (row) => formatNumber(row.count) },
          ]}
          rows={studentCourseRows}
        />
        <DataTable
          title="Monthly Fee Summary"
          columns={[
            { key: 'month', label: 'Month' },
            { key: 'collected', label: 'Collected', render: (row) => formatMoney(row.collected) },
            { key: 'due', label: 'Due', render: (row) => formatMoney(row.due) },
            { key: 'overdue', label: 'Overdue' },
          ]}
          rows={monthlyFeeRows}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DataTable
          title="Students Needing Attendance Attention"
          columns={[
            { key: 'name', label: 'Student' },
            { key: 'rollNumber', label: 'Roll No.' },
            { key: 'percentage', label: 'Attendance', render: (row) => formatPercent(row.percentage) },
            { key: 'present', label: 'Present/Total', render: (row) => `${row.present}/${row.total}` },
          ]}
          rows={lowAttendanceRows}
          emptyText="No attendance records for selected month."
        />
        <DataTable
          title="Most Viewed Notices"
          columns={[
            { key: 'title', label: 'Notice' },
            { key: 'category', label: 'Category' },
            { key: 'views', label: 'Views', render: (row) => formatNumber(row.views) },
          ]}
          rows={stats.notices?.mostViewed || []}
          emptyText="No notice views yet."
        />
      </div>

      <div className="glass-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Quick Report Links</h2>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">Jump into detailed modules for actions behind these numbers.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/students" className="btn-secondary btn-sm">Students</Link>
            <Link to="/admin/rooms" className="btn-secondary btn-sm">Rooms</Link>
            <Link to="/admin/fees" className="btn-secondary btn-sm">Fees</Link>
            <Link to="/admin/attendance/report" className="btn-secondary btn-sm">Attendance</Link>
            <Link to="/admin/leaves" className="btn-secondary btn-sm">Leaves</Link>
            <Link to="/admin/complaints" className="btn-secondary btn-sm">Complaints</Link>
            <Link to="/admin/notices" className="btn-secondary btn-sm">Notices</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
