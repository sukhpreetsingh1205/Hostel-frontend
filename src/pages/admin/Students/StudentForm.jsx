import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createStudent, updateStudent, fetchStudentById } from '../../../features/student/studentSlice';
import { fetchRooms } from '../../../features/room/roomSlice';
import { toast } from 'react-hot-toast';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentStudent, loading } = useSelector((state) => state.student);
  const { rooms } = useSelector((state) => state.room);
  const [selectedRoom, setSelectedRoom] = useState('');
  const formSectionTitle = 'text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4';
  const labelClass = 'input-label';
  const inputClass = 'input-field';
  const selectClass = 'select-field';
  const availableRooms = rooms.filter((room) => {
    const availableBeds = room.availableBeds ?? ((room.capacity || 0) - (room.currentOccupancy || 0));
    return room._id === selectedRoom || (room.status === 'available' && availableBeds > 0);
  });
  const selectedRoomDetails = rooms.find((room) => room._id === selectedRoom);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchRooms({ limit: 1000 }));
    if (id) {
      dispatch(fetchStudentById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentStudent && id) {
      setValue('name', currentStudent.userId?.name);
      setValue('email', currentStudent.userId?.email);
      setValue('phone', currentStudent.userId?.phone);
      setValue('studentId', currentStudent.studentId);
      setValue('rollNumber', currentStudent.rollNumber);
      setValue('course', currentStudent.course);
      setValue('year', currentStudent.year);
      setValue('branch', currentStudent.branch);
      setValue('semester', currentStudent.semester);
      setValue('dob', currentStudent.dob?.split('T')[0]);
      setValue('bloodGroup', currentStudent.bloodGroup);
      setValue('parentName', currentStudent.parentName);
      setValue('parentPhone', currentStudent.parentPhone);
      setValue('address', currentStudent.address);
      setValue('emergencyContact', currentStudent.emergencyContact);
      setValue('messPreference', currentStudent.messPreference);
      setValue('medicalConditions', currentStudent.medicalConditions);
      setSelectedRoom(currentStudent.roomId?._id || '');
    }
  }, [currentStudent, id, setValue]);

  const onSubmit = async (data) => {
    const studentData = {
      ...data,
      roomId: selectedRoom || null,
    };

    let result;
    if (id) {
      result = await dispatch(updateStudent({ id, data: studentData }));
    } else {
      result = await dispatch(createStudent(studentData));
    }

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(selectedRoom ? 'Student saved and room allotment email sent if SMTP is configured' : (id ? 'Student updated successfully' : 'Student created successfully'));
      navigate('/admin/students');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
            {id ? 'Edit Student' : 'Add New Student'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {id ? 'Update student information' : 'Enter student details to register'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className={formSectionTitle}>Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={inputClass}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={inputClass}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Phone *</label>
                <input
                  {...register('phone', { 
                    required: 'Phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  className={inputClass}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  {...register('dob')}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Blood Group</label>
                <select {...register('bloodGroup')} className={selectClass}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h2 className={formSectionTitle}>Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Student ID *</label>
                <input
                  {...register('studentId', { required: 'Student ID is required' })}
                  className={inputClass}
                  placeholder="HOSTEL/2024/1001"
                />
                {errors.studentId && <p className="mt-1 text-xs text-red-600">{errors.studentId.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Roll Number *</label>
                <input
                  {...register('rollNumber', { required: 'Roll number is required' })}
                  className={inputClass}
                />
                {errors.rollNumber && <p className="mt-1 text-xs text-red-600">{errors.rollNumber.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Course *</label>
                <select {...register('course', { required: 'Course is required' })} className={selectClass}>
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Year *</label>
                <select {...register('year', { required: 'Year is required' })} className={selectClass}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Branch *</label>
                <input
                  {...register('branch', { required: 'Branch is required' })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Semester</label>
                <input
                  type="number"
                  {...register('semester')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div>
            <h2 className={formSectionTitle}>Parent/Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Parent Name *</label>
                <input
                  {...register('parentName', { required: 'Parent name is required' })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Parent Phone *</label>
                <input
                  {...register('parentPhone', { 
                    required: 'Parent phone is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Address *</label>
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  rows="3"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Emergency Contact</label>
                <input
                  {...register('emergencyContact')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Hostel Information */}
          <div>
            <h2 className={formSectionTitle}>Hostel Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Allot Room</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Not Allotted</option>
                  {availableRooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.block}-{room.roomNumber} - {room.type} ({room.availableBeds ?? ((room.capacity || 0) - (room.currentOccupancy || 0))} beds available)
                    </option>
                  ))}
                </select>
                {selectedRoomDetails && (
                  <div className="mt-3 rounded-lg border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800 dark:border-brand-800/60 dark:bg-brand-950/30 dark:text-brand-200">
                    Room {selectedRoomDetails.block}-{selectedRoomDetails.roomNumber}, Floor {selectedRoomDetails.floor}, Rent Rs. {selectedRoomDetails.rent?.toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Mess Preference</label>
                <select {...register('messPreference')} className={selectClass}>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Medical Conditions (if any)</label>
                <textarea
                  {...register('medicalConditions')}
                  rows="2"
                  className={inputClass}
                  placeholder="Any allergies, chronic conditions, etc."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : (id ? 'Update Student' : 'Create Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
