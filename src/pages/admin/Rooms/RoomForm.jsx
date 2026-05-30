import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createRoom, updateRoom, fetchRoomById } from '../../../features/room/roomSlice';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RoomForm = () => {
  const { id } = useParams();
  const AMENITY_OPTIONS = [
  'bed', 'table', 'chair', 'cupboard', 
  'fan', 'balcony', 'study table', 'bookshelf'
];
  const isEdit = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRoom, loading } = useSelector((s) => s.room);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit) dispatch(fetchRoomById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentRoom) {
      reset({
        roomNumber: currentRoom.roomNumber,
        block: currentRoom.block,
        floor: currentRoom.floor,
        type: currentRoom.type,
        capacity: currentRoom.capacity,
        rent: currentRoom.rent,
        status: currentRoom.status,
        amenities: currentRoom.amenities?.join(', ') || '',
      });
    }
  }, [currentRoom, isEdit, reset]);

  const onSubmit = async (data) => {
    const roomData = {
      ...data,
      capacity: Number(data.capacity),
      rent: Number(data.rent),
      floor: Number(data.floor),
      amenities: data.amenities || [],
    };
    let result;
    if (isEdit) {
      result = await dispatch(updateRoom({ id, data: roomData }));
    } else {
      result = await dispatch(createRoom(roomData));
    }
    if (!result.error) {
      toast.success(isEdit ? 'Room updated!' : 'Room created!');
      navigate('/admin/rooms');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="page-header">
        <div>
          <button onClick={() => navigate('/admin/rooms')} className="btn-ghost btn-sm mb-2"><FiArrowLeft className="w-4 h-4" /> Back to Rooms</button>
          <h1 className="page-title">{isEdit ? 'Edit Room' : 'Add New Room'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Room Number *</label>
            <input {...register('roomNumber', { required: 'Required' })} className="input-field" placeholder="101" />
            {errors.roomNumber && <p className="mt-1 text-xs text-red-500">{errors.roomNumber.message}</p>}
          </div>
          <div>
            <label className="input-label">Block *</label>
            <select {...register('block', { required: 'Required' })} className="select-field">
              <option value="">Select Block</option>
              {['A', 'B', 'C', 'D', 'E'].map((b) => <option key={b} value={b}>Block {b}</option>)}
            </select>
            {errors.block && <p className="mt-1 text-xs text-red-500">{errors.block.message}</p>}
          </div>
          <div>
            <label className="input-label">Floor *</label>
            <input {...register('floor', { required: 'Required' })} type="number" min="0" max="10" className="input-field" placeholder="1" />
            {errors.floor && <p className="mt-1 text-xs text-red-500">{errors.floor.message}</p>}
          </div>
          <div>
            <label className="input-label">Room Type *</label>
            <select {...register('type', { required: 'Required' })} className="select-field">
              <option value="">Select Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
              <option value="dormitory">Dormitory</option>
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
          </div>
          <div>
            <label className="input-label">Capacity *</label>
            <input {...register('capacity', { required: 'Required' })} type="number" min="1" max="10" className="input-field" placeholder="2" />
            {errors.capacity && <p className="mt-1 text-xs text-red-500">{errors.capacity.message}</p>}
          </div>
          <div>
            <label className="input-label">Monthly Rent (₹) *</label>
            <input {...register('rent', { required: 'Required' })} type="number" min="0" className="input-field" placeholder="5000" />
            {errors.rent && <p className="mt-1 text-xs text-red-500">{errors.rent.message}</p>}
          </div>
          <div>
            <label className="input-label">Status</label>
            <select {...register('status')} className="select-field">
              <option value="available">Available</option>
              <option value="full">Full</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="input-label">Amenities</label>
            {AMENITY_OPTIONS.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={amenity}
                    {...register('amenities')}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm capitalize text-surface-600 dark:text-surface-300 group-hover:text-primary-500 transition-colors">
                    {amenity}
                  </span>
                </label>
              ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
          <button type="button" onClick={() => navigate('/admin/rooms')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            <FiSave className="w-4 h-4" /> {loading ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
