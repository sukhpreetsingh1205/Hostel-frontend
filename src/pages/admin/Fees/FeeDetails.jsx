import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { feeApi } from '../../../api/feeApi';

const FeeDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await feeApi.getById(id);
        if (mounted) setFee(res.data?.data || res.data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || 'Failed to load fee details');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Details</h1>
          <p className="text-gray-600 mt-1">View fee record and payment status</p>
        </div>
        <Link to="/admin/fees" className="btn btn-outline btn-sm">
          Back
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
        ) : !fee ? (
          <div className="text-gray-600">No fee record found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500">Student</div>
              <div className="font-semibold text-gray-900">{fee.studentId?.userId?.name || '—'}</div>
              <div className="text-sm text-gray-500">{fee.studentId?.rollNumber || ''}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Month / Year</div>
              <div className="font-semibold text-gray-900">
                {fee.month} {fee.year}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="font-semibold text-gray-900">₹{Number(fee.totalAmount || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Paid</div>
              <div className="font-semibold text-gray-900">₹{Number(fee.paidAmount || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Balance</div>
              <div className="font-semibold text-gray-900">₹{Number(fee.balance || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-semibold text-gray-900 capitalize">{fee.status || '—'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeDetails;
