import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStudent } from '../../features/student/studentSlice';
import { updatePassword } from '../../features/auth/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiLock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentStudent } = useSelector((state) => state.student);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    parentName: currentStudent?.parentName || '',
    parentPhone: currentStudent?.parentPhone || '',
    address: currentStudent?.address || '',
    emergencyContact: currentStudent?.emergencyContact || '',
    medicalConditions: currentStudent?.medicalConditions || '',
    messPreference: currentStudent?.messPreference || 'veg',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateStudent({
      id: currentStudent?._id,
      data: formData,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    const result = await dispatch(updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Password updated successfully');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-3xl font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="opacity-90">{currentStudent?.rollNumber}</p>
            <p className="opacity-90">{currentStudent?.course} - Year {currentStudent?.year}</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Edit Profile
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <FiUser className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user?.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiMail className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiPhone className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{user?.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiCalendar className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-gray-900">
                  {currentStudent?.dob ? new Date(currentStudent.dob).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiUser className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentStudent?.parentName || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiPhone className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentStudent?.parentPhone || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 md:col-span-2">
              <FiMapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentStudent?.address || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiPhone className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentStudent?.emergencyContact || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Mess Preference</label>
                {isEditing ? (
                  <select
                    name="messPreference"
                    value={formData.messPreference}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="jain">Jain</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900 capitalize">{currentStudent?.messPreference || 'Vegetarian'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 md:col-span-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                {isEditing ? (
                  <textarea
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    rows="2"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Any allergies, chronic conditions, etc."
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{currentStudent?.medicalConditions || 'None'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Change Password
            </button>
          ) : (
            <button
              onClick={() => setShowPasswordForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;