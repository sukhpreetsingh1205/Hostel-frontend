import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentReducer from '../features/student/studentSlice';
import roomReducer from '../features/room/roomSlice';
import feeReducer from '../features/fee/feeSlice';
import attendanceReducer from '../features/attendence/attendanceSlice';
import leaveReducer from '../features/leave/leaveSlice';
import complaintReducer from '../features/complaint/complaintSlice';
import noticeReducer from '../features/notice/noticeSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  room: roomReducer,
  fee: feeReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  complaint: complaintReducer,
  notice: noticeReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
