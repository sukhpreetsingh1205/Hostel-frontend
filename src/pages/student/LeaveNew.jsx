import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createLeave } from '../../features/leave/leaveSlice';
import { toast } from 'react-hot-toast';

const LeaveNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.leave);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'day_leave',
    },
  });

  const fromDate = watch('fromDate');
  const toDate = watch('toDate');

  const onSubmit = async (data) => {
    const result = await dispatch(createLeave(data));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Leave request submitted');
      navigate('/student/leaves', { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
          <p className="text-gray-600 mt-1">Submit a new leave request</p>
        </div>
        <Link to="/student/leaves" className="btn btn-outline btn-sm">
          Back
        </Link>
      </div>

      {error ? <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div> : null}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                {...register('type', { required: 'Leave type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="day_leave">Day Leave</option>
                <option value="short_leave">Short Leave (4–8 hours)</option>
                <option value="weekend_leave">Weekend Leave</option>
                <option value="long_leave">Long Leave (&gt;3 days)</option>
                <option value="emergency_leave">Emergency Leave</option>
                <option value="medical_leave">Medical Leave</option>
              </select>
              {errors.type ? <p className="mt-1 text-xs text-red-600">{errors.type.message}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Contact</label>
              <input
                type="tel"
                inputMode="numeric"
                {...register('parentContact', {
                  required: 'Parent contact is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Phone must be 10 digits' },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="10-digit number"
              />
              {errors.parentContact ? (
                <p className="mt-1 text-xs text-red-600">{errors.parentContact.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date &amp; Time</label>
              <input
                type="datetime-local"
                {...register('fromDate', { required: 'From date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.fromDate ? <p className="mt-1 text-xs text-red-600">{errors.fromDate.message}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date &amp; Time</label>
              <input
                type="datetime-local"
                {...register('toDate', {
                  required: 'To date is required',
                  validate: (value) => {
                    if (!fromDate || !value) return true;
                    return new Date(fromDate) < new Date(value) || 'To date must be after from date';
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.toDate ? <p className="mt-1 text-xs text-red-600">{errors.toDate.message}</p> : null}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              {...register('destination', { required: 'Destination is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Where are you going?"
            />
            {errors.destination ? <p className="mt-1 text-xs text-red-600">{errors.destination.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              rows={4}
              {...register('reason', { required: 'Reason is required', maxLength: { value: 500, message: 'Max 500 characters' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Explain your reason"
            />
            {errors.reason ? <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p> : null}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/student/leaves" className="btn btn-ghost btn-sm">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading || (fromDate && toDate && new Date(fromDate) >= new Date(toDate))}>
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>

          {fromDate && toDate && new Date(fromDate) >= new Date(toDate) ? (
            <div className="text-xs text-red-600">From date must be before To date.</div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default LeaveNew;

