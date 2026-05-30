import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiSearch, FiBell, FiSun, FiMoon,
  FiChevronDown, FiLogOut, FiUser, FiSettings,
  FiMaximize2, FiMinimize2
} from 'react-icons/fi';

const Navbar = ({ onMenuToggle, onSidebarCollapse, sidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const { notifications = [], unreadCount = 0 } = useSelector((state) => state.dashboard);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-2">
          {/* Mobile menu toggle */}
          <button onClick={onMenuToggle} className="btn-icon lg:hidden">
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar collapse */}
          <button
            onClick={onSidebarCollapse}
            className="btn-icon hidden lg:flex"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <FiMaximize2 className="w-4 h-4" />
            ) : (
              <FiMinimize2 className="w-4 h-4" />
            )}
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-xl text-sm text-surface-700 dark:text-surface-300 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Mobile search */}
          <button onClick={() => setShowSearch(!showSearch)} className="btn-icon md:hidden">
            <FiSearch className="w-5 h-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FiSun className="w-5 h-5 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FiMoon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn-icon relative"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 glass-card p-0 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Notifications</h3>
                    <p className="text-xs text-surface-500 mt-0.5">{unreadCount} unread</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-surface-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            if (n.link) navigate(n.link);
                            setShowNotifications(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors border-b border-surface-100 dark:border-surface-800 ${
                            !n.read ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{n.title}</p>
                          <p className="text-xs text-surface-500 mt-0.5 truncate">{n.message}</p>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative ml-1" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-surface-500 capitalize">{user?.role}</p>
              </div>
              <FiChevronDown className="w-3.5 h-3.5 text-surface-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 glass-card p-2 z-50"
                >
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-700 pt-1">
                    {user?.role === 'student' && (
                      <button
                        onClick={() => { navigate('/student/profile'); setShowUserMenu(false); }}
                        className="w-full sidebar-link text-xs"
                      >
                        <FiUser className="w-4 h-4" /> My Profile
                      </button>
                    )}
                    <button
                      onClick={() => { toggleTheme(); setShowUserMenu(false); }}
                      className="w-full sidebar-link text-xs"
                    >
                      {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <div className="border-t border-surface-200 dark:border-surface-700 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full sidebar-link text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-surface-200 dark:border-surface-700 overflow-hidden"
          >
            <div className="p-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
