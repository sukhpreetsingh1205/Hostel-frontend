import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRooms, deleteRoom } from '../../../features/room/roomSlice';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Pagination from '../../../components/common/Pagination';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEye, FiEdit2, FiTrash2, FiGrid, FiList, FiUserPlus } from 'react-icons/fi';

const RoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading, pagination } = useSelector((s) => s.room);
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { dispatch(fetchRooms({ page, limit: 12 })); }, [dispatch, page]);

  const handleDelete = async () => {
    await dispatch(deleteRoom(deleteId));
    setDeleteId(null);
    dispatch(fetchRooms({ page, limit: 12 }));
  };

  const statusColor = { available: 'badge-success', full: 'badge-danger', maintenance: 'badge-warning' };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-subtitle">Manage hostel rooms and allocations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-100 dark:bg-surface-800 rounded-xl p-0.5">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white dark:bg-surface-700 shadow-sm' : ''}`}>
              <FiGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white dark:bg-surface-700 shadow-sm' : ''}`}>
              <FiList className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => navigate('/admin/rooms/new')} className="btn-primary">
            <FiPlus className="w-4 h-4" /> Add Room
          </button>
        </div>
      </div>

      {loading && !rooms?.length ? <LoadingSpinner /> : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms?.map((room, i) => (
            <motion.div key={room._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-hover p-5 cursor-pointer" onClick={() => navigate(`/admin/rooms/${room._id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-surface-900 dark:text-white">{room.roomNumber}</p>
                  <p className="text-xs text-surface-500">Block {room.block} • Floor {room.floor}</p>
                </div>
                <span className={`badge ${statusColor[room.status] || 'badge-neutral'}`}>{room.status}</span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Type</span>
                  <span className="font-medium text-surface-800 dark:text-surface-200 capitalize">{room.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Capacity</span>
                  <span className="font-medium text-surface-800 dark:text-surface-200">{room.currentOccupancy}/{room.capacity}</span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5 mt-1">
                  <div className="bg-brand-500 rounded-full h-1.5 transition-all" style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Rent</span>
                  <span className="font-semibold text-brand-500">₹{room.rent?.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-1 mt-4 pt-3 border-t border-surface-200 dark:border-surface-700">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/rooms/${room._id}/assign`); }} className="btn-ghost btn-sm flex-1"><FiUserPlus className="w-3 h-3" /> Allot</button>
                <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/rooms/${room._id}/edit`); }} className="btn-ghost btn-sm flex-1"><FiEdit2 className="w-3 h-3" /> Edit</button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteId(room._id); }} className="btn-ghost btn-sm flex-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"><FiTrash2 className="w-3 h-3" /> Delete</button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Room</th><th>Block</th><th>Floor</th><th>Type</th><th>Occupancy</th><th>Rent</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {rooms?.map((room) => (
                  <tr key={room._id}>
                    <td className="font-semibold">{room.roomNumber}</td>
                    <td>{room.block}</td>
                    <td>{room.floor}</td>
                    <td className="capitalize">{room.type}</td>
                    <td>{room.currentOccupancy}/{room.capacity}</td>
                    <td className="text-brand-500 font-semibold">₹{room.rent?.toLocaleString()}</td>
                    <td><span className={`badge ${statusColor[room.status] || 'badge-neutral'}`}>{room.status}</span></td>
                    <td><div className="flex justify-end gap-1">
                      <button onClick={() => navigate(`/admin/rooms/${room._id}`)} className="btn-icon"><FiEye className="w-4 h-4" /></button>
                      <button onClick={() => navigate(`/admin/rooms/${room._id}/assign`)} className="btn-icon"><FiUserPlus className="w-4 h-4" /></button>
                      <button onClick={() => navigate(`/admin/rooms/${room._id}/edit`)} className="btn-icon"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(room._id)} className="btn-icon text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {pagination && <Pagination currentPage={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Room" message="This room will be permanently removed." confirmText="Delete" danger />
    </div>
  );
};

export default RoomList;
