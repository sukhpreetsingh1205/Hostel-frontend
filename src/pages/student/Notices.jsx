import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveNotices } from '../../features/notice/noticeSlice';

const Notices = () => {
  const dispatch = useDispatch();
  const { activeNotices, loading } = useSelector((state) => state.notice);

  useEffect(() => {
    dispatch(fetchActiveNotices());
  }, [dispatch]);

  const pinned = activeNotices?.pinned || [];
  const recent = activeNotices?.recent || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
        <p className="text-gray-600 mt-1">Latest announcements from hostel administration</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-700">Pinned</h2>
              {pinned.map((n) => (
                <div key={n._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="font-semibold text-gray-900">{n.title}</div>
                  <div className="text-sm text-gray-700 mt-1">{n.content}</div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">Recent</h2>
            {recent.map((n) => (
              <div key={n._id} className="bg-white rounded-lg shadow p-4">
                <div className="font-semibold text-gray-900">{n.title}</div>
                <div className="text-sm text-gray-700 mt-1">{n.content}</div>
              </div>
            ))}
            {pinned.length === 0 && recent.length === 0 && (
              <div className="text-gray-600">No active notices.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
