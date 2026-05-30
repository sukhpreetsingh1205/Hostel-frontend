import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createComplaint } from '../../features/complaint/complaintSlice';
import { toast } from 'react-hot-toast';

const categories = [
  'Room Maintenance',
  'Mess Food Quality',
  'Cleanliness & Housekeeping',
  'Internet/WiFi Issue',
  'Security Concern',
  'Harassment/Bullying',
  'Medical Emergency',
  'Electricity/Water Issue',
  'Staff Behavior',
  'Other',
];

const ComplaintNew = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.complaint);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priority: 'medium',
      category: 'Room Maintenance',
    },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(createComplaint(data));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Complaint submitted');
      navigate('/student/complaints', { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raise a Complaint</h1>
          <p className="text-gray-600 mt-1">Submit an issue for staff/warden to resolve</p>
        </div>
        <Link to="/student/complaints" className="btn btn-outline btn-sm">
          Back
        </Link>
      </div>

      {error ? <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div> : null}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category ? <p className="mt-1 text-xs text-red-600">{errors.category.message}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select {...register('priority')} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 characters' } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Short summary"
            />
            {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={5}
              {...register('description', {
                required: 'Description is required',
                maxLength: { value: 1000, message: 'Max 1000 characters' },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Explain the issue with details"
            />
            {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description.message}</p> : null}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/student/complaints" className="btn btn-ghost btn-sm">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintNew;

