import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '../../features/auth/authSlice';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(forgotPassword(data.email));
    if (!result.error) setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
          <FiCheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Check your email</h2>
        <p className="text-sm text-surface-500">We&apos;ve sent a password reset link to your email address. The link expires in 10 minutes.</p>
        <Link to="/login" className="btn-secondary inline-flex"><FiArrowLeft className="w-4 h-4" /> Back to login</Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Forgot Password</h2>
        <p className="mt-1 text-sm text-surface-500">Enter your email and we&apos;ll send you a reset link</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="input-label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} type="email" className="input-field pl-10" placeholder="you@example.com" />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <p className="text-center text-sm text-surface-500">
        <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600"><FiArrowLeft className="inline w-3 h-3 mr-1" />Back to login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
