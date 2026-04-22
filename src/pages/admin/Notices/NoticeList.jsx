import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotices, deleteNotice, togglePinNotice } from '../../../features/notice/noticeSlice';
import { FiPlus, FiEdit2, FiTrash2, FiPin, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const NoticeList = () => {
  const dispatch = useDispatch();
  const { notices, loading } = useSelector((state) => state.notice);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete notice "${title}"?`)) {
      const result = await dispatch(deleteNotice(id));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Notice deleted successfully');
      }
    }
  };

  const handleTogglePin = async (id) => {
    await dispatch(togglePinNotice(id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-600 mt-1">Manage announcements and notices</p>
        </div>
        <Link
          to="/admin/notices/new"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus />
          <span>Post Notice</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pinned Notices */}
          {notices.filter(n => n.isPinned).map((notice) => (
            <div key={notice._id} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FiPin className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {notice.category} • Posted by {notice.postedBy?.name} • {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-2">{notice.content}</p>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Views: {notice.views}</span>
                    <span>Valid till: {new Date(notice.validTill).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleTogglePin(notice._id)}
                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                    title="Unpin"
                  >
                    <FiPin className="h-5 w-5" />
                  </button>
                  <Link
                    to={`/admin/notices/${notice._id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(notice._id, notice.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Regular Notices */}
          {notices.filter(n => !n.isPinned).map((notice) => (
            <div key={notice._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {notice.category} • Posted by {notice.postedBy?.name} • {new Date(notice.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">{notice.content}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleTogglePin(notice._id)}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-gray-100 rounded-lg"
                    title="Pin"
                  >
                    <FiPin className="h-5 w-5" />
                  </button>
                  <Link
                    to={`/admin/notices/${notice._id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(notice._id, notice.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeList;