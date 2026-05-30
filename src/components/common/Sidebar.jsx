import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiUsers, FiGrid, FiDollarSign, FiCalendar,
  FiClipboard, FiAlertCircle, FiBell, FiBarChart2,
  FiChevronDown, FiUser, FiBookOpen, FiMessageSquare,
  FiClock, FiFileText
} from 'react-icons/fi';

const adminMenu = [
  { label: 'Dashboard', path: '/admin', icon: FiHome },
  {
    label: 'Students', icon: FiUsers, children: [
      { label: 'All Students', path: '/admin/students' },
      { label: 'Add Student', path: '/admin/students/new' },
    ],
  },
  {
    label: 'Rooms', icon: FiGrid, children: [
      { label: 'All Rooms', path: '/admin/rooms' },
      { label: 'Add Room', path: '/admin/rooms/new' },
    ],
  },
  {
    label: 'Fees', icon: FiDollarSign, children: [
      { label: 'All Fees', path: '/admin/fees' },
      { label: 'Generate Fees', path: '/admin/fees/generate' },
    ],
  },
  {
    label: 'Attendance', icon: FiCalendar, children: [
      { label: 'Mark Attendance', path: '/admin/attendance/mark' },
      { label: 'Reports', path: '/admin/attendance/report' },
    ],
  },
  { label: 'Leave Requests', path: '/admin/leaves', icon: FiClipboard },
  { label: 'Complaints', path: '/admin/complaints', icon: FiAlertCircle },
  {
    label: 'Notices', icon: FiBell, children: [
      { label: 'All Notices', path: '/admin/notices' },
      { label: 'Post Notice', path: '/admin/notices/new' },
    ],
  },
  { label: 'Reports', path: '/admin/reports', icon: FiBarChart2 },
];

const wardenMenu = [
  { label: 'Dashboard', path: '/warden', icon: FiHome },
  { label: 'Students', path: '/warden/students', icon: FiUsers },
  { label: 'Rooms', path: '/warden/rooms', icon: FiGrid },
  {
    label: 'Attendance', icon: FiCalendar, children: [
      { label: 'Mark Attendance', path: '/warden/attendance' },
      { label: 'Reports', path: '/warden/attendance/report' },
    ],
  },
  { label: 'Leave Requests', path: '/warden/leaves', icon: FiClipboard },
  { label: 'Complaints', path: '/warden/complaints', icon: FiAlertCircle },
];

const studentMenu = [
  { label: 'Dashboard', path: '/student', icon: FiHome },
  { label: 'My Profile', path: '/student/profile', icon: FiUser },
  { label: 'My Room', path: '/student/room', icon: FiGrid },
  { label: 'My Fees', path: '/student/fees', icon: FiDollarSign },
  { label: 'Attendance', path: '/student/attendance', icon: FiCalendar },
  { label: 'Leaves', path: '/student/leaves', icon: FiClipboard },
  { label: 'Complaints', path: '/student/complaints', icon: FiMessageSquare },
  { label: 'Notices', path: '/student/notices', icon: FiBell },
];

const getMenuForRole = (role) => {
  if (role === 'admin') return adminMenu;
  if (role === 'warden') return wardenMenu;
  return studentMenu;
};

const SidebarItem = ({ item, collapsed }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = hasChildren
    ? item.children.some((c) => location.pathname === c.path)
    : location.pathname === item.path;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={`sidebar-link w-full justify-between ${isActive ? 'sidebar-link-active' : ''}`}
        >
          <span className="flex items-center gap-3">
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </span>
          {!collapsed && (
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          )}
        </button>
        <AnimatePresence>
          {open && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-4 pl-4 border-l border-surface-200 dark:border-surface-700"
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  end
                  className={({ isActive: active }) =>
                    `sidebar-link mt-1 text-xs ${active ? 'sidebar-link-active' : ''}`
                  }
                >
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive: active }) =>
        `sidebar-link ${active ? 'sidebar-link-active' : ''}`
      }
    >
      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const { user } = useSelector((state) => state.auth);
  const menu = getMenuForRole(user?.role);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-surface-200 dark:border-surface-700/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">H</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-surface-900 dark:text-white truncate">Hostel MS</h1>
            <p className="text-[10px] text-surface-500 dark:text-surface-400 capitalize">{user?.role} Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menu.map((item, idx) => (
          <SidebarItem key={item.path || idx} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User card */}
      {!collapsed && (
        <div className="p-3 border-t border-surface-200 dark:border-surface-700/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-100 dark:bg-surface-800/50">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-surface-500 dark:text-surface-400 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-r border-surface-200 dark:border-surface-700/50 transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-[260px] z-50 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 lg:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
