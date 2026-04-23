import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAttendance } from '../../features/attendence/attendanceSlice';

const MyAttendance = () => {
  const dispatch = useDispatch();
  const { currentStudent } = useSelector((state) => state.student);
  const { studentAttendance } = useSelector((state) => state.attendance);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (currentStudent?._id) {
      dispatch(fetchStudentAttendance({
        studentId: currentStudent._id,
        month: selectedMonth,
        year: selectedYear,
      }));
    }
  }, [dispatch, currentStudent, selectedMonth, selectedYear]);

  const attendance = studentAttendance?.data || [];
  const summary = studentAttendance?.summary;

  const statusByDay = attendance.reduce((acc, record) => {
    const date = new Date(record.date);
    if (Number.isNaN(date.getTime())) return acc;
    if (date.getFullYear() !== selectedYear || date.getMonth() + 1 !== selectedMonth) return acc;
    acc[date.getDate()] = record.status;
    return acc;
  }, {});

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0=Sun

  const statusToClasses = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'leave':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Attendance Percentage</p>
          <p className="text-2xl font-bold text-indigo-600">{summary?.percentage || 0}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Present Days</p>
          <p className="text-2xl font-bold text-green-600">{summary?.present || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Absent Days</p>
          <p className="text-2xl font-bold text-red-600">{summary?.absent || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Leaves Taken</p>
          <p className="text-2xl font-bold text-purple-600">{summary?.leave || 0}</p>
        </div>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Calendar</h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-semibold text-gray-500 py-2">
              {d}
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
                className={`border rounded-lg p-2 min-h-16 flex flex-col items-center justify-center ${statusToClasses(status)}`}
              >
                <div className="text-sm font-bold">{day}</div>
                <div className="text-[10px] uppercase tracking-wide mt-1">
                  {status ? status : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Legend</h3>
        <div className="flex space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Late</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">On Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
