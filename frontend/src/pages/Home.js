import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Smart Electricity Connection & Approval System
          </h1>
          <p className="text-xl text-gray-600">
            Fast, transparent, and paperless electricity connection process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">For Customers</h3>
            <ul className="space-y-3 text-gray-700">
              <li>✓ Online application submission</li>
              <li>✓ Real-time application tracking</li>
              <li>✓ Digital document verification</li>
              <li>✓ Online payment support</li>
              <li>✓ SMS/Email notifications</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-green-600 mb-4">For Field Staff</h3>
            <ul className="space-y-3 text-gray-700">
              <li>✓ Task assignments</li>
              <li>✓ Route optimization</li>
              <li>✓ Real-time status updates</li>
              <li>✓ Customer confirmation</li>
              <li>✓ Meter data capture</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">For Admin</h3>
            <ul className="space-y-3 text-gray-700">
              <li>✓ Dashboard analytics</li>
              <li>✓ Application management</li>
              <li>✓ Staff scheduling</li>
              <li>✓ Performance reports</li>
              <li>✓ System monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
