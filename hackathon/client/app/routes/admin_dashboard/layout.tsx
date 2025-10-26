import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Dashboard,
  People, // For Customers & Vendors
  Storefront, // For Vendors specific
  Settings,
  Menu,
  Close,
  Logout,
  AdminPanelSettings, // Icon for Admin
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { getAdmin } from '~/redux/actions';
// Assume you have getAdmin action
// import { getAdmin } from '~/redux/actions'; 

export default function AdminDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Assumes admin data is stored in `currentAdmin`
  const admin = useSelector((state: any) => state.reducer.admin);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      if (!admin) {
        dispatch(getAdmin(adminId)); // Fetch admin data if needed
      }
    } else {
      // If no adminId, redirect to admin login
      navigate("/admin_login");
    }
  }, [dispatch, admin, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    // Optionally dispatch a logout action
    navigate("/admin_login");
  };

  // --- Admin-specific nav links ---
  const navLinks = [
    { name: "Dashboard", href: "/admin_dashboard", icon: <Dashboard fontSize="small" /> },
    { name: "Vendors", href: "/admin_dashboard/vendors", icon: <Storefront fontSize="small" /> },
    { name: "Customers", href: "/admin_dashboard/customers", icon: <People fontSize="small" /> },
    { name: "Settings", href: "/admin_dashboard/settings", icon: <Settings fontSize="small" /> },
  ];

  const getLinkClasses = (href: string) => {
    const isActive = location.pathname === href;
    return isActive
      ? "bg-red-600 text-white font-medium shadow-md" // Active: Red pill
      : "text-gray-600 hover:bg-gray-100 hover:text-red-600"; // Inactive
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link to="/admin_dashboard" className="flex items-center gap-2 text-gray-900">
          <AdminPanelSettings className="text-red-600" />
          <span className="text-xl font-bold tracking-tight">Admin Panel</span>
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
            {/* Maybe add breadcrumbs or page title here later */}
          </div>

          {/* Admin Info Section */}
          <div className="flex items-center space-x-4">
             <span className="hidden md:block text-sm font-medium text-gray-700 pr-2">
                 {admin?.email || "Admin"} {/* Display admin email */}
              </span>
             <AdminPanelSettings className="text-gray-500" />
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