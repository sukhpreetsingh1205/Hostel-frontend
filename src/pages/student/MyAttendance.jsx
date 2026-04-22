import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAttendance } from '../../features/attendance/attendanceSlice';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyAttendance = () => {
  const dispatch = useDispatch();
  const { currentStudent } = useSelector((state) => state.student);
  const { attendance, summary } = useSelector((state) => state.attendance);
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

  const events = attendance?.map(record => ({
    title: record.status.toUpperCase(),
    start: new Date(record.date),
    end: new Date(record.date),
    allDay: true,
    status: record.status,
  })) || [];

  const eventStyleGetter = (event) => {
    let backgroundColor = '#10B981'; // green for present
    if (event.status === 'absent') backgroundColor = '#EF4444';
    if (event.status === 'late') backgroundColor = '#F59E0B';
    if (event.status === 'leave') backgroundColor = '#8B5CF6';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
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
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['month']}
            defaultView="month"
            date={new Date(selectedYear, selectedMonth - 1, 1)}
            onNavigate={(date) => {
              setSelectedMonth(date.getMonth() + 1);
              setSelectedYear(date.getFullYear());
            }}
            eventPropGetter={eventStyleGetter}
            style={{ height: '100%' }}
          />
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