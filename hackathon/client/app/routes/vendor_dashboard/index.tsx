import React from 'react';
import { AttachMoney, ShoppingCart, ListAlt, Inventory } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AddCircleOutline, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardHover = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const buttonHover = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

// Enhanced Stat Card
const StatCard = ({ title, value, icon, color, linkTo }: { title: string, value: string | number, icon: JSX.Element, color: string, linkTo?: string }) => {
  const content = (
    <motion.div
      variants={itemVariants}
      whileHover={linkTo ? cardHover.hover : undefined}
      className={`bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between transition-all duration-300 overflow-hidden ${linkTo ? 'cursor-pointer hover:shadow-2xl' : ''}`}
      style={{ border: '1px solid #e5e7eb' }}
    >
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <motion.div
        className={`p-4 rounded-xl ${color}`}
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.5 }}
      >
        {React.cloneElement(icon, { style: { fontSize: '2rem' } })}
      </motion.div>
    </motion.div>
  );

  return linkTo ? <Link to={linkTo} className="block no-underline">{content}</Link> : content;
};

// Mock data
const recentOrders = [
  { id: "#1234", customer: "Jeevan", date: "Oct 26, 2025", total: "$75.00", status: "Pending" },
  { id: "#1233", customer: "Alex", date: "Oct 25, 2025", total: "$120.00", status: "Shipped" },
  { id: "#1232", customer: "Maria", date: "Oct 25, 2025", total: "$45.50", status: "Delivered" },
];

export default function VendorDashboardIndex() {
  const vendor = useSelector((state) => state.reducer.vendor);
  const navigate = useNavigate();

  const totalRevenue = vendor?.balance || "$0.00";
  const totalOrders = vendor?.orders?.length || 0;
  const newOrdersCount = recentOrders.filter(o => o.status === 'Pending').length;
  const totalProducts = vendor?.products?.length || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome, {vendor?.shopName || "Vendor"}!
          </h1>
          <p className="text-xl text-gray-600">Here's a quick overview of your shop.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={<AttachMoney className="text-emerald-600" />}
            color="bg-emerald-100"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCart className="text-indigo-600" />}
            color="bg-indigo-100"
            linkTo="/vendor_dashboard/orders"
          />
          <StatCard
            title="New Orders"
            value={newOrdersCount}
            icon={<ListAlt className="text-amber-600" />}
            color="bg-amber-100"
            linkTo="/vendor_dashboard/orders?status=pending"
          />
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Inventory className="text-purple-600" />}
            color="bg-purple-100"
            linkTo="/vendor_dashboard/products"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={(e) => navigate("/vendor_dashboard/products/new")}
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <AddCircleOutline />
                Add New Product
              </motion.button>
              <motion.button
                onClick={() => navigate("/vendor_dashboard/orders")}
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                className="border-2 border-indigo-600 text-indigo-600 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 flex items-center gap-2"
              >
                <Visibility />
                View All Orders
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <Link
                to="/vendor_dashboard/orders"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition duration-300 flex items-center gap-1"
              >
                View All <Visibility className="text-base" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                        No recent orders.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="hover:bg-indigo-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}