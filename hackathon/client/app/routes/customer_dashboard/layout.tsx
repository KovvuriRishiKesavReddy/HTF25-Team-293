import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Dashboard, 
  ShoppingBag,
  Person, 
  FavoriteBorder, // For Wishlist
  Search, 
  Menu, 
  Close, 
  Logout,
  ShoppingCart,
  Storefront 
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '~/redux/actions';

export default function CustomerDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customer = useSelector((state: any) => state.reducer.currentUser);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUser(userId));
    } else {
      navigate("/");
    }
  }, [customer]);


  console.log("Customer Data in Layout:", customer);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/customer_login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/customer_dashboard", icon: <Dashboard fontSize="small" /> },
    { name: "My Orders", href: "/customer_dashboard/orders", icon: <ShoppingBag fontSize="small" /> },
    { name: "Wishlist", href: "/customer_dashboard/wishlist", icon: <FavoriteBorder fontSize="small" /> },
    { name: "My Profile", href: "/customer_dashboard/profile", icon: <Person fontSize="small" /> },
    { name: "My Cart", href: "/cart", icon: <ShoppingCart fontSize="small" /> },
  ];

  const getLinkClasses = (href: string) => {
    const isActive = location.pathname === href;
    return isActive
      ? "bg-blue-600 text-white shadow-lg" 
      : "text-blue-200 hover:bg-blue-700 hover:text-white";
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Storefront className="text-blue-300" />
          <span className="text-xl font-bold tracking-tight">E-Shop</span>
        </Link>
        {isMobile && (
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-blue-200 hover:text-white"
          >
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
            className={`flex items-center space-x-3 p-2.5 rounded-xl transition-all duration-300 ${getLinkClasses(link.href)}`}
          >
            {link.icon}
            <span className="font-medium text-sm">{link.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-3 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 p-2.5 rounded-xl text-blue-200 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <Logout fontSize="small" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      <aside className="hidden md:flex w-64 h-screen bg-blue-900 text-white flex-col flex-shrink-0 shadow-2xl">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black/60 z-20 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside 
              className="w-64 h-screen bg-blue-900 text-white flex-col fixed inset-y-0 left-0 z-30 md:hidden shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-blue-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden text-blue-600 mr-4 hover:text-blue-800"
            >
              <Menu />
            </button>
            
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 lg:w-96 pl-10 pr-4 py-2.5 rounded-full border-2 border-blue-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors">
              <span className="text-sm font-semibold text-blue-800">
                Welcome, {customer?.name || "Guest"}!
              </span>
            </div>
            <Link to="/customer_dashboard/profile" className="flex items-center space-x-2 p-2 rounded-full transition-all duration-300 hover:bg-blue-100">
              <img
                src={customer?.picture || "https://res.cloudinary.com/doxykd1yk/image/upload/v1751733473/download_ywnnsj.png"}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-300 shadow-md"
              />
            </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-8 bg-white/50 backdrop-blur-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}