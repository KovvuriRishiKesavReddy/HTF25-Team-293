import React from 'react';
import { Storefront, People, PendingActions, AttachMoney } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Stat Card Component (similar to vendor dashboard)
const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

export default function AdminDashboardIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Vendors"
          value="15" // Replace with actual data
          icon={<Storefront className="text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Pending Vendors"
          value="3" // Replace with actual data
          icon={<PendingActions className="text-yellow-800" />}
          color="bg-yellow-100"
        />
        <StatCard
          title="Total Customers"
          value="128" // Replace with actual data
          icon={<People className="text-green-800" />}
          color="bg-green-100"
        />
         <StatCard
          title="Total Sales"
          value="$15,230" // Replace with actual data
          icon={<AttachMoney className="text-purple-800" />}
          color="bg-purple-100"
        />
      </div>

      {/* --- Quick Actions Section --- */}
      <div className="bg-white rounded-lg shadow-md p-6">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
         <div className="flex flex-wrap gap-4">
             <Link 
                to="/admin_dashboard/vendors" 
                className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg text-sm transition"
             >
                Manage Vendor Approvals
             </Link>
              <Link 
                to="/admin_dashboard/customers" 
                className="px-5 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg text-sm transition"
             >
                View Customers
             </Link>
             {/* Add more actions as needed */}
         </div>
      </div>
    </div>
  );
}


