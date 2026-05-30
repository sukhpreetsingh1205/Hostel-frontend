import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { clearError, login } from '../../features/auth/authSlice';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(true);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(login(data));
    if (result.payload?.user) {
      const role = result.payload.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'warden') navigate('/warden');
      else navigate('/student');
    }
  };

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Sign in to your account to continue
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="input-label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              type="email"
              className="input-field pl-10"
              placeholder="you@example.com"
              id="login-email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="input-label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              type={showPassword ? 'text' : 'password'}
              className="input-field pl-10 pr-10"
              placeholder="••••••••"
              id="login-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-brand-500 focus:ring-brand-500/30"
            />
            <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:hover:text-brand-400"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
          id="login-submit"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            <>
              Sign in <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-600 dark:hover:text-brand-400">
          Register
        </Link>
      </p>

      {/* Demo Credentials */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800"
        >
          <button
            onClick={() => setShowDemo(false)}
            className="absolute top-2 right-2 text-surface-400 hover:text-surface-600 text-xs"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-3">
            <FiInfo className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin@hostel.com', 'Admin@123')}
              className="text-left p-2.5 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
            >
              <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">Admin</p>
              <p className="text-[10px] text-surface-400 mt-0.5">admin@hostel.com</p>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('student@edu.com', 'Student@123')}
              className="text-left p-2.5 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
            >
              <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">Student</p>
              <p className="text-[10px] text-surface-400 mt-0.5">student@edu.com</p>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
