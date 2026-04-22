import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './features/auth/authSlice';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import StudentList from './pages/admin/Students/StudentList';
import StudentForm from './pages/admin/Students/StudentForm';
import StudentDetails from './pages/admin/Students/StudentDetails';
import RoomList from './pages/admin/Rooms/RoomList';
import RoomForm from './pages/admin/Rooms/RoomForm';
import FeeList from './pages/admin/Fees/FeeList';
import GenerateFees from './pages/admin/Fees/GenerateFees';
import AttendanceMarking from './pages/admin/Attendance/AttendanceMarking';
import AttendanceReport from './pages/admin/Attendance/AttendanceReport';
import LeaveRequests from './pages/admin/Leaves/LeaveRequests';
import ComplaintList from './pages/admin/Complaints/ComplaintList';
import NoticeList from './pages/admin/Notices/NoticeList';
import NoticeForm from './pages/admin/Notices/NoticeForm';

// Warden Pages
import WardenDashboard from './pages/warden/WardenDashboard';
import WardenAttendanceMarking from './pages/warden/AttendanceMarking';
import LeaveApproval from './pages/warden/LeaveApproval';
import ComplaintManagement from './pages/warden/ComplaintManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyProfile from './pages/student/MyProfile';
import MyRoom from './pages/student/MyRoom';
import MyFees from './pages/student/MyFees';
import MyAttendance from './pages/student/MyAttendance';
import MyLeaves from './pages/student/MyLeaves';
import MyComplaints from './pages/student/MyComplaints';
import Notices from './pages/student/Notices';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<StudentList />} />
        <Route path="/admin/students/new" element={<StudentForm />} />
        <Route path="/admin/students/:id" element={<StudentDetails />} />
        <Route path="/admin/students/:id/edit" element={<StudentForm />} />
        <Route path="/admin/rooms" element={<RoomList />} />
        <Route path="/admin/rooms/new" element={<RoomForm />} />
        <Route path="/admin/rooms/:id/edit" element={<RoomForm />} />
        <Route path="/admin/fees" element={<FeeList />} />
        <Route path="/admin/fees/generate" element={<GenerateFees />} />
        <Route path="/admin/attendance/mark" element={<AttendanceMarking />} />
        <Route path="/admin/attendance/report" element={<AttendanceReport />} />
        <Route path="/admin/leaves" element={<LeaveRequests />} />
        <Route path="/admin/complaints" element={<ComplaintList />} />
        <Route path="/admin/notices" element={<NoticeList />} />
        <Route path="/admin/notices/new" element={<NoticeForm />} />
        <Route path="/admin/notices/:id/edit" element={<NoticeForm />} />
      </Route>

      {/* Warden Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/warden" element={<WardenDashboard />} />
        <Route path="/warden/attendance" element={<WardenAttendanceMarking />} />
        <Route path="/warden/leaves" element={<LeaveApproval />} />
        <Route path="/warden/complaints" element={<ComplaintManagement />} />
      </Route>

      {/* Student Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<MyProfile />} />
        <Route path="/student/room" element={<MyRoom />} />
        <Route path="/student/fees" element={<MyFees />} />
        <Route path="/student/attendance" element={<MyAttendance />} />
        <Route path="/student/leaves" element={<MyLeaves />} />
        <Route path="/student/complaints" element={<MyComplaints />} />
        <Route path="/student/notices" element={<Notices />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    </Routes>
  );
}

export default App;