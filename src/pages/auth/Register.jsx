import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { clearError, registerUser } from '../../features/auth/authSlice';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft, FiBook, FiHash, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Account', 'Student Details', 'Review'];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    defaultValues: { role: 'student' },
  });

  const role = watch('role');

  const nextStep = async () => {
    const fields = step === 0
      ? ['name', 'email', 'password', 'phone']
      : ['studentId', 'rollNumber', 'course', 'year', 'branch', 'semester', 'dob', 'parentName', 'parentPhone', 'address'];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (result.payload?.user) {
      const r = result.payload.user.role;
      navigate(r === 'admin' ? '/admin' : r === 'warden' ? '/warden' : '/student');
    }
  };

  const allData = watch();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Create Account</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">Register to get started</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-500' : 'text-surface-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? 'bg-brand-500 text-white' : 'bg-surface-200 dark:bg-surface-700 text-surface-500'} ${i < step ? 'bg-emerald-500' : ''}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-brand-500' : 'bg-surface-200 dark:bg-surface-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Account */}
          {step === 0 && (
            <motion.div key="step0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input {...register('name', { required: 'Name is required' })} className="input-field pl-10" placeholder="John Doe" />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="input-label">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} type="email" className="input-field pl-10" placeholder="you@example.com" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} type={showPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                    {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="input-label">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input {...register('phone', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: '10-digit phone' } })} className="input-field pl-10" placeholder="9876543210" />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="input-label">Role</label>
                <select {...register('role')} className="select-field">
                  <option value="student">Student</option>
                  <option value="warden">Warden</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 2: Student Details */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Student ID</label>
                  <input {...register('studentId', { required: role === 'student' ? 'Required' : false })} className="input-field" placeholder="STU001" />
                  {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId.message}</p>}
                </div>
                <div>
                  <label className="input-label">Roll Number</label>
                  <input {...register('rollNumber', { required: role === 'student' ? 'Required' : false })} className="input-field" placeholder="2024CSE001" />
                  {errors.rollNumber && <p className="mt-1 text-xs text-red-500">{errors.rollNumber.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Course</label>
                  <select {...register('course', { required: role === 'student' ? 'Required' : false })} className="select-field">
                    <option value="">Select</option>
                    {['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'MBA', 'PhD'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.course && <p className="mt-1 text-xs text-red-500">{errors.course.message}</p>}
                </div>
                <div>
                  <label className="input-label">Branch</label>
                  <input {...register('branch', { required: role === 'student' ? 'Required' : false })} className="input-field" placeholder="CSE" />
                  {errors.branch && <p className="mt-1 text-xs text-red-500">{errors.branch.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="input-label">Year</label>
                  <input {...register('year', { required: role === 'student' ? 'Required' : false, valueAsNumber: true })} type="number" min="1" max="5" className="input-field" placeholder="1" />
                  {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year.message}</p>}
                </div>
                <div>
                  <label className="input-label">Semester</label>
                  <input {...register('semester', { required: role === 'student' ? 'Required' : false, valueAsNumber: true })} type="number" min="1" max="10" className="input-field" placeholder="1" />
                  {errors.semester && <p className="mt-1 text-xs text-red-500">{errors.semester.message}</p>}
                </div>
                <div>
                  <label className="input-label">DOB</label>
                  <input {...register('dob', { required: role === 'student' ? 'Required' : false })} type="date" className="input-field" />
                  {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
                </div>
              </div>
              <div>
                <label className="input-label">Parent/Guardian Name</label>
                <input {...register('parentName', { required: role === 'student' ? 'Required' : false })} className="input-field" placeholder="Parent name" />
                {errors.parentName && <p className="mt-1 text-xs text-red-500">{errors.parentName.message}</p>}
              </div>
              <div>
                <label className="input-label">Parent Phone</label>
                <input {...register('parentPhone', { required: role === 'student' ? 'Required' : false, pattern: { value: /^[0-9]{10}$/, message: '10-digit phone' } })} className="input-field" placeholder="9876543210" />
                {errors.parentPhone && <p className="mt-1 text-xs text-red-500">{errors.parentPhone.message}</p>}
              </div>
              <div>
                <label className="input-label">Address</label>
                <textarea {...register('address', { required: role === 'student' ? 'Required' : false })} className="input-field" rows="2" placeholder="Home address" />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <div className="glass-card p-4 space-y-3">
                <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Account Info</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-surface-500">Name:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.name}</span></div>
                  <div><span className="text-surface-500">Email:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.email}</span></div>
                  <div><span className="text-surface-500">Phone:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.phone}</span></div>
                  <div><span className="text-surface-500">Role:</span> <span className="badge badge-brand">{allData.role}</span></div>
                </div>
              </div>
              {allData.role === 'student' && (
                <div className="glass-card p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Student Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-surface-500">Student ID:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.studentId}</span></div>
                    <div><span className="text-surface-500">Roll:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.rollNumber}</span></div>
                    <div><span className="text-surface-500">Course:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.course}</span></div>
                    <div><span className="text-surface-500">Branch:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.branch}</span></div>
                    <div><span className="text-surface-500">Year/Sem:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.year}/{allData.semester}</span></div>
                    <div><span className="text-surface-500">Parent:</span> <span className="font-medium text-surface-800 dark:text-surface-200">{allData.parentName}</span></div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1">
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {step < (role === 'student' ? 2 : 0) ? (
            <button type="button" onClick={nextStep} className="btn-primary flex-1">
              Next <FiArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <>Register <FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
