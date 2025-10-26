import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard,
  Inventory2, // For Products
  ListAlt, // For Orders
  Settings,
  Search,
  Menu,
  Close,
  Logout,
  Storefront,
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { getVendor } from '~/redux/actions';
// We'll assume you have a getVendor action
// import { getVendor } from '~/redux/actions'; 

export default function VendorDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Assumes you store the vendor in `currentVendor`
  const vendor = useSelector((state: any) => state.reducer.vendor);

  useEffect(() => {
    const vendorId = localStorage.getItem("vendorId");
    if (vendorId) {
      if (!vendor) {
        dispatch(getVendor(vendorId)); // Fetch vendor data if not in state
      }

      // --- CRITICAL VENDOR STATUS CHECK ---
      if (vendor) {
        if (vendor.status === 'Pending') {
          navigate('/vendor_pending');
        } else if (vendor.status === 'Rejected') {
          // You can create a 'vendor_rejected' page too
          navigate('/vendor_pending'); // For now, send to pending
        }
        // If status is "Approved", they stay here.
      }
    } else {
      // If no vendorId, boot them to the login page
      navigate("/vendor_login");
    }
  }, [dispatch, vendor, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("vendorId");
    navigate("/vendor_login");
  };

  // --- Vendor-specific nav links ---
  const navLinks = [
    { name: "Dashboard", href: "/vendor_dashboard", icon: <Dashboard fontSize="small" /> },
    { name: "Products", href: "/vendor_dashboard/products", icon: <Inventory2 fontSize="small" /> },
    { name: "Orders", href: "/vendor_dashboard/orders", icon: <ListAlt fontSize="small" /> },
    { name: "Settings", href: "/vendor_dashboard/settings", icon: <Settings fontSize="small" /> },
  ];

  const getLinkClasses = (href: string) => {
    const isActive = location.pathname === href;
    return isActive
      ? "bg-teal-600 text-white font-medium shadow-md" // Active: Teal pill
      : "text-gray-600 hover:bg-gray-100 hover:text-teal-600"; // Inactive
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link to="/vendor_dashboard" className="flex items-center gap-2 text-gray-900">
          <Storefront className="text-teal-600" />
          <span className="text-xl font-bold tracking-tight">Vendor Portal</span>
        </Link>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">
            <Close />
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-3 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
            className={`flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200 ${getLinkClasses(link.href)}`}
          >
            {link.icon}
            <span className="text-sm font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 p-2.5 rounded-lg text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-200 group"
        >
          <Logout fontSize="small" className="text-gray-600 group-hover:text-white" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* --- Desktop Sidebar (Light Theme) --- */}
      <aside className="hidden md:flex w-64 h-screen bg-white text-gray-900 flex-col flex-shrink-0 border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside 
              className="w-64 h-screen bg-white text-gray-900 flex-col fixed inset-y-0 left-0 z-30 md:hidden shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* --- Top Navbar --- */}
        <header className="h-16 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden text-gray-600 mr-4"
            >
              <Menu />
            </button>
            <div className="relative hidden sm:block">
              {/* No search bar needed here, vendors search on products/orders pages */}
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Link to="/vendor_dashboard/settings" className="flex items-center space-x-3 p-1 rounded-full transition-all duration-300 hover:bg-gray-100">
              <img
                src={vendor?.shopLogo || "https://via.placeholder.com/150"}
                alt="Shop Logo"
                className="h-9 w-9 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700 pr-2">
                 {vendor?.shopName || "My Shop"}
              </span>
            </Link>
          </div>
        </header>
        
        {/* --- MAIN PAGE CONTENT --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}