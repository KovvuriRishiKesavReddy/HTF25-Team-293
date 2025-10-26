import React from 'react';

export default function CustomerDashboardIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome back, Jeevan!</h2>
        <p className="text-gray-600 mt-2">
          From here you can view your recent orders, manage your profile, and check your cart.
        </p>
      </div>

      {/* Quick Stats Example */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">$125.50</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Items in Cart</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">5</p>
        </div>
      </div>
    </div>
  );
}