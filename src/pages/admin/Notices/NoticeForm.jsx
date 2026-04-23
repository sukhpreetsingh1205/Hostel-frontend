import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createNotice, fetchNoticeById, updateNotice } from '../../../features/notice/noticeSlice';

const NoticeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentNotice, loading } = useSelector((state) => state.notice);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      priority: 'medium',
      validTill: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (id) dispatch(fetchNoticeById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id && currentNotice?._id === id) {
      reset({
        title: currentNotice.title || '',
        content: currentNotice.content || '',
        category: currentNotice.category || 'general',
        priority: currentNotice.priority || 'medium',
        validTill: currentNotice.validTill ? new Date(currentNotice.validTill).toISOString().slice(0, 10) : '',
        isActive: Boolean(currentNotice.isActive),
      });
    }
  }, [currentNotice, id, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      validTill: data.validTill ? new Date(data.validTill).toISOString() : undefined,
    };

    const result = id
      ? await dispatch(updateNotice({ id, data: payload }))
      : await dispatch(createNotice(payload));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(id ? 'Notice updated' : 'Notice posted');
      navigate('/admin/notices', { replace: true });
    } else {
      toast.error(result.payload || 'Failed to save notice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Notice' : 'Post Notice'}</h1>
          <p className="text-gray-600 mt-1">Create announcements for students and staff</p>
        </div>
        <Link to="/admin/notices" className="btn btn-outline btn-sm">
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            {...register('content', { required: 'Content is required' })}
          />
          {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register('category')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" {...register('validTill')} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="checkbox checkbox-sm" {...register('isActive')} />
          Active
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeForm;
