import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/api';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const ApplicationTracker = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationService.getMyApplications();
        setApplications(response.data.applications);
      } catch (error) {
        toast.error('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      meter_scheduled: 'bg-purple-100 text-purple-800',
      connected: 'bg-green-100 text-green-800',
      bill_activated: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'rejected') return <FaTimesCircle />;
    if (['approved', 'connected', 'bill_activated'].includes(status)) return <FaCheckCircle />;
    return <FaClock />;
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h2>

        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 text-lg mb-4">No applications yet</p>
            <a href="/apply" className="text-blue-600 hover:text-blue-700 font-bold">
              Submit a new application
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Application #{app.id}
                    </h3>
                    <p className="text-gray-600">{app.address}, {app.city}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold flex items-center space-x-2 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span>{app.status.replace('_', ' ').toUpperCase()}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-semibold">{app.connection_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Load (kW)</p>
                    <p className="font-semibold">{app.required_load}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment</p>
                    <p className="font-semibold">{app.payment_status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Documents</p>
                    <p className="font-semibold">{app.documents_verified ? 'Verified' : 'Pending'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
