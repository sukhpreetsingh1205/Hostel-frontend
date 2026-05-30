import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { resetPassword } from '../../features/auth/authSlice';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const getStrength = (pw) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-500'];

  const onSubmit = async (data) => {
    const result = await dispatch(resetPassword({ token, password: data.password }));
    if (!result.error) setSuccess(true);
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
          <FiCheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Password Reset!</h2>
        <p className="text-sm text-surface-500">Your password has been updated successfully.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">Sign in with new password</button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Set New Password</h2>
        <p className="mt-1 text-sm text-surface-500">Create a strong password for your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="input-label">New Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400"><FiEye className="w-4 h-4" /></button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">{[1,2,3,4,5].map((i) => (<div key={i} className={`h-1 flex-1 rounded ${i <= strength ? strengthColors[strength] : 'bg-surface-200 dark:bg-surface-700'}`} />))}</div>
              <p className="text-xs text-surface-500">{strengthLabels[strength]}</p>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <label className="input-label">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input {...register('confirmPassword', { required: 'Required', validate: (v) => v === password || 'Passwords do not match' })} type="password" className="input-field pl-10" placeholder="••••••••" />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
