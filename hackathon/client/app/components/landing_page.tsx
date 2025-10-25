import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// MUI Icons
import ArrowForward from "@mui/icons-material/ArrowForward";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Twitter from "@mui/icons-material/Twitter";
import GitHub from "@mui/icons-material/GitHub";
import Star from "@mui/icons-material/Star";
import Storefront from "@mui/icons-material/Storefront";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import BarChart from "@mui/icons-material/BarChart";
import Edit from "@mui/icons-material/Edit";
import Login from "@mui/icons-material/Login";
import PersonAdd from "@mui/icons-material/PersonAdd";
import RocketLaunch from "@mui/icons-material/RocketLaunch";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Main Landing Page Component
export function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // --- Pie Chart Data & Options ---
  const pieChartData = {
    labels: ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Groceries', 'Toys'],
    datasets: [
      {
        label: 'Marketplace Share',
        data: [30, 20, 18, 12, 10, 10],
        backgroundColor: [
          'rgba(22, 163, 74, 0.7)', // Green
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(217, 70, 239, 0.7)', // Fuchsia
          'rgba(249, 115, 22, 0.7)', // Orange
          'rgba(234, 179, 8, 0.7)',  // Yellow
          'rgba(236, 72, 153, 0.7)', // Pink
        ],
        borderColor: [
          '#16a34a',
          '#3b82f6',
          '#d946ef',
          '#f97316',
          '#eab308',
          '#ec4899',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e5e7eb', // Text color for legend
          font: {
            size: 14,
            family: 'Inter, sans-serif'
          }
        },
      },
      tooltip: {
        titleFont: {
          size: 16,
          family: 'Inter, sans-serif'
        },
        bodyFont: {
          size: 14,
          family: 'Inter, sans-serif'
        },
        backgroundColor: '#1f2937', // Tooltip background
        titleColor: '#e5e7eb',
        bodyColor: '#e5e7eb',
      }
    },
  };


  return (
    <div className="min-h-screen font-inter text-white bg-gradient-to-br from-[#0b0a23] via-[#1a1841] to-[#14122d]">
      
      {/* --- 1. NAVIGATION BAR --- */}
      <motion.nav
        className="flex justify-between items-center p-4 sm:px-12 bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-cyan-400/20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/"
          className="flex items-center cursor-pointer"
        >
          {/* Logo Placeholder */}
          <motion.div 
            className="h-14 w-14 max-sm:h-12 max-sm:w-12 mr-3 rounded-full shadow-lg border-2 border-cyan-400/50 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Storefront className="text-white" />
          </motion.div>
          <span className="text-xl font-bold text-cyan-300 drop-shadow-[0_0_10px_#0ff] transition-colors duration-300 hover:text-white">
            E-Shop
          </span>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link
            to="/customer_login"
            className="text-cyan-300 hover:text-white font-medium transition duration-200 px-4 py-2 rounded-full hover:bg-white/10 hidden sm:block"
          >
            Customer Login
          </Link>
          <Link
            to="/admin_login"
            className="text-gray-400 hover:text-white font-medium transition duration-200 px-4 py-2 rounded-full hover:bg-white/10 hidden lg:block"
          >
            Admin Login
          </Link>
          <Link
            to="/vendor_login"
            className="bg-cyan-500 text-slate-950 px-6 py-2.5 rounded-full font-semibold hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_15px_#0ff] hover:scale-105"
          >
            Become a Vendor
          </Link>
        </div>
      </motion.nav>

      <main className="overflow-hidden">
        
        {/* --- 2. HERO SECTION --- */}
        <section
          className="relative py-24 md:py-40 flex items-center justify-center text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(11, 10, 35, 0.85), rgba(26, 24, 65, 0.85)), url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold text-cyan-300 mb-6 drop-shadow-[0_0_12px_#0ff] leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              The Future of{" "}
              <span className="text-pink-400 drop-shadow-[0_0_12px_#f0f]">
                Shopping
              </span>{" "}
              is Here
            </motion.h1>
            <motion.p
              className="text-lg text-cyan-100 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Discover products from thousands of vendors, or launch your own
              successful online store on our cutting-edge platform.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold bg-white text-blue-700 shadow-[0_0_15px_#0ff] hover:bg-blue-100 transition-transform hover:scale-105"
              >
                Start Shopping <ShoppingCart className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/vendor/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold bg-transparent text-cyan-300 border-2 border-cyan-400 shadow-[0_0_15px_#0ff] hover:bg-cyan-400/20 transition-all hover:scale-105"
              >
                Sell With Us <Storefront className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        <div className="bg-gradient-to-b from-[#14122d] via-[#1a1841] to-[#0b0a23] py-20">
          {/* --- 3. FEATURES SECTION --- */}
          <section className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-pink-400 mb-6 drop-shadow-[0_0_8px_#f0f]">
                A Platform Built for Everyone
              </h2>
              <p className="text-lg text-cyan-100 mb-16 max-w-3xl mx-auto">
                Whether you're a shopper, a seller, or an administrator,
                our platform provides the tools you need for a seamless experience.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Card 1: Customers */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 hover:scale-105 hover:border-pink-400 transition-all duration-300"
              >
                <ShoppingCart className="text-pink-400 w-16 h-16 mb-4 drop-shadow-[0_0_8px_#f0f]" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  For Customers
                </h3>
                <p className="text-cyan-200 text-center">
                  Enjoy a vast selection, secure checkout, and real-time
                  order tracking from all your favorite vendors.
                </p>
              </motion.div>
              {/* Card 2: Vendors */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 hover:scale-105 hover:border-cyan-400 transition-all duration-300"
              >
                <Storefront className="text-cyan-300 w-16 h-16 mb-4 drop-shadow-[0_0_8px_#0ff]" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  For Vendors
                </h3>
                <p className="text-cyan-200 text-center">
                  Get a powerful dashboard, inventory management, and
                  detailed sales analytics to grow your business.
                </p>
              </motion.div>
              {/* Card 3: Admins */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 hover:scale-105 hover:border-purple-400 transition-all duration-300"
              >
                <AdminPanelSettings className="text-purple-400 w-16 h-16 mb-4 drop-shadow-[0_0_8px_#9370DB]" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  For Admins
                </h3>
                <p className="text-cyan-200 text-center">
                  Oversee vendors, manage product categories, set commissions,
                  and ensure platform integrity with ease.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 4. HOW IT WORKS (FOR VENDORS) --- */}
          <section className="py-24 max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-cyan-300 mb-6 drop-shadow-[0_0_8px_#0ff]">
                Launch Your Store in Minutes
              </h2>
              <p className="text-lg text-cyan-100 mb-16 max-w-3xl mx-auto">
                Our streamlined process makes it incredibly simple to
                start your e-commerce journey as a vendor.
              </p>
            </motion.div>

            <motion.div
              className="relative grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400/20 hidden md:block" />
              
              {/* Step 1 */}
              <motion.div
                variants={itemVariants}
                className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-cyan-400/30"
              >
                <div className="absolute -top-6 flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400 text-slate-900 font-extrabold text-2xl drop-shadow-[0_0_8px_#0ff]">
                  1
                </div>
                <PersonAdd className="text-cyan-300 w-12 h-12 my-4" />
                <h3 className="text-2xl font-semibold text-white mt-4 mb-2">
                  Register
                </h3>
                <p className="text-cyan-200">
                  Fill out the secure registration form with your shop details.
                  Get approved by our admin team.
                </p>
              </motion.div>
              {/* Step 2 */}
              <motion.div
                variants={itemVariants}
                className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-cyan-400/30"
              >
                <div className="absolute -top-6 flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400 text-slate-900 font-extrabold text-2xl drop-shadow-[0_0_8px_#0ff]">
                  2
                </div>
                <Edit className="text-cyan-300 w-12 h-12 my-4" />
                <h3 className="text-2xl font-semibold text-white mt-4 mb-2">
                  Upload Products
                </h3>
                <p className="text-cyan-200">
                  Use your vendor dashboard to easily add products, descriptions,
                  images, and set your inventory.
                </p>
              </motion.div>
              {/* Step 3 */}
              <motion.div
                variants={itemVariants}
                className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-cyan-400/30"
              >
                <div className="absolute -top-6 flex items-center justify-center w-12 h-12 rounded-full bg-cyan-400 text-slate-900 font-extrabold text-2xl drop-shadow-[0_0_8px_#0ff]">
                  3
                </div>
                <RocketLaunch className="text-cyan-300 w-12 h-12 my-4" />
                <h3 className="text-2xl font-semibold text-white mt-4 mb-2">
                  Start Selling
                </h3>
                <p className="text-cyan-200">
                  Go live and start receiving orders. Manage sales and
                  track your revenue all in one place.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 5. NEW GRAPH SECTION --- */}
          <section className="py-24 max-w-7xl mx-auto px-6">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <motion.h2
                  className="text-4xl font-bold text-pink-400 mb-6 drop-shadow-[0_0_8px_#f0f]"
                  variants={itemVariants}
                >
                  Our Thriving Marketplace
                </motion.h2>
                <motion.p
                  className="text-lg text-cyan-100 mb-8 max-w-xl mx-auto lg:mx-0"
                  variants={itemVariants}
                >
                  E-Shop is home to a diverse and rapidly growing range of
                  categories. Our platform empowers vendors across all sectors to
                  reach a massive, engaged audience.
                </motion.p>
                <motion.div
                  className="bg-white/5 p-6 rounded-lg border border-white/20"
                  variants={itemVariants}
                >
                  <BarChart className="text-cyan-300 w-10 h-10 mb-3" />
                  <h4 className="text-xl font-semibold text-white mb-2">Real-Time Analytics</h4>
                  <p className="text-cyan-200">
                    Vendors get access to powerful, real-time data to track
                    performance, understand customer behavior, and optimize
                    their sales strategies.
                  </p>
                </motion.div>
              </div>

              {/* Chart Content */}
              <motion.div
                className="bg-white/5 p-6 md:p-8 rounded-2xl shadow-lg border border-white/20"
                variants={itemVariants}
              >
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                  Top Category Share
                </h3>
                <Pie data={pieChartData} options={pieChartOptions} />
              </motion.div>
            </motion.div>
          </section>


          {/* --- 6. TESTIMONIALS --- */}
          <section className="py-24 max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-pink-400 mb-6 drop-shadow-[0_0_8px_#f0f]">
                Loved by Vendors and Shoppers
              </h2>
              <p className="text-lg text-cyan-100 mb-16 max-w-2xl mx-auto">
                See what our users are saying about the E-Shop platform.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Testimonial 1 */}
              <motion.div
                variants={itemVariants}
                className="bg-white/5 p-6 rounded-lg border border-white/20"
              >
                <p className="text-cyan-200 mb-4">
                  "This platform has been a game-changer for my small business.
                  The vendor dashboard is intuitive and my sales have tripled!"
                </p>
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                </div>
                <p className="text-white font-bold mt-2">- Sarah J. (Vendor)</p>
              </motion.div>
              {/* Testimonial 2 */}
              <motion.div
                variants={itemVariants}
                className="bg-white/5 p-6 rounded-lg border border-white/20"
              >
                <p className="text-cyan-200 mb-4">
                  "As a customer, I love the variety. I can buy from so many
                  different stores in one single order. It's so convenient!"
                </p>
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                </div>
                <p className="text-white font-bold mt-2">- David L. (Customer)</p>
              </motion.div>
              {/* Testimonial 3 */}
              <motion.div
                variants={itemVariants}
                className="bg-white/5 p-6 rounded-lg border border-white/20"
              >
                <p className="text-cyan-200 mb-4">
                  "The analytics are fantastic. I can see exactly who my
                  customers are and what products are trending. Highly recommend."
                </p>
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                </div>
                <p className="text-white font-bold mt-2">- Maria G. (Vendor)</p>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 7. LOGIN/ENGAGE SECTION --- */}
          <section className="py-24 max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-pink-400 mb-6 drop-shadow-[0_0_8px_#f0f]">
                Find Your Entry Point
              </h2>
              <p className="text-lg text-cyan-100 mb-16 max-w-3xl mx-auto">
                Ready to get started? Log in to your dedicated portal.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Card 1: Customer Login */}
              <motion.div variants={itemVariants}>
                <Link
                  to="/login"
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:border-pink-400 transition-all duration-300 h-full"
                >
                  <Login className="w-16 h-16 text-pink-400 mb-4 drop-shadow-[0_0_8px_#f0f]" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Customer Login
                  </h3>
                  <p className="text-cyan-200 mb-4">
                    Access your account, track orders, manage your wishlist,
                    and enjoy a seamless checkout.
                  </p>
                  <span className="text-pink-400 font-bold hover:underline mt-auto">
                    Login Now <ArrowForward className="inline-block" />
                  </span>
                </Link>
              </motion.div>
              {/* Card 2: Vendor Login */}
              <motion.div variants={itemVariants}>
                <Link
                  to="/vendor/login"
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:border-cyan-400 transition-all duration-300 h-full"
                >
                  <Storefront className="w-16 h-16 text-cyan-400 mb-4 drop-shadow-[0_0_8px_#0ff]" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Vendor Portal
                  </h3>
                  <p className="text-cyan-200 mb-4">
                    Sign in to your dashboard to manage products, view sales
                    analytics, and handle new orders.
                  </p>
                  <span className="text-cyan-400 font-bold hover:underline mt-auto">
                    Go to Dashboard <ArrowForward className="inline-block" />
                  </span>
                </Link>
              </motion.div>
              {/* Card 3: Admin Login */}
              <motion.div variants={itemVariants}>
                <Link
                  to="/admin-login"
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:border-purple-400 transition-all duration-300 h-full"
                >
                  <AdminPanelSettings className="w-16 h-16 text-purple-400 mb-4 drop-shadow-[0_0_8px_#9370DB]" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Admin Dashboard
                  </h3>
                  <p className="text-cyan-200 mb-4">
                    Access the administrative backend to manage the entire
                    marketplace, vendors, and settings.
                  </p>
                  <span className="text-purple-400 font-bold hover:underline mt-auto">
                    Access Portal <ArrowForward className="inline-block" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 8. FINAL CTA --- */}
          <section className="py-24 bg-transparent">
            <motion.div
              className="max-w-6xl mx-auto px-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl font-bold text-cyan-300 mb-6 drop-shadow-[0_0_8px_#0ff]">
                Ready to Join the Revolution?
              </h2>
              <p className="text-lg text-cyan-100 mb-12 max-w-2xl mx-auto">
                Sign up for free as a customer to start shopping, or
                register as a vendor to start building your empire.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center px-10 py-5 rounded-full text-xl font-bold bg-white text-blue-700 shadow-[0_0_15px_#0ff] hover:bg-blue-100 transition-transform hover:scale-105"
              >
                Sign Up for Free <ArrowForward className="ml-3 w-6 h-6" />
              </Link>
            </motion.div>
          </section>
        </div>
      </main>

      {/* --- 9. NEW & IMPROVED FOOTER --- */}
      <footer className="bg-gradient-to-r from-violet-950 to-indigo-950 backdrop-blur-md py-12 text-center text-cyan-200 border-t border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex justify-center items-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div 
              className="h-16 w-16 max-sm:h-12 max-sm:w-12 rounded-full shadow-lg border border-cyan-400/50 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600"
            >
              <Storefront className="text-white" />
            </div>
            <p className="ml-4 text-2xl max-sm:text-lg font-bold text-cyan-300 drop-shadow-[0_0_8px_#0ff]">
              E-Shop
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left md:text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* Column 1: Shop */}
            <motion.div
              className="flex flex-col items-start md:items-center text-left md:text-center"
              variants={itemVariants}
            >
              <h2 className="text-lg font-bold text-white mb-4">Shop</h2>
              <div className="flex flex-col items-start md:items-center gap-3 text-sm">
                <Link
                  to="/categories/electronics"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Electronics
                </Link>
                <Link
                  to="/categories/fashion"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Fashion
                </Link>
                <Link
                  to="/categories/home"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Home & Kitchen
                </Link>
                <Link
                  to="/categories/books"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Books
                </Link>
              </div>
            </motion.div>
            {/* Column 2: Sell */}
            <motion.div
              className="flex flex-col items-start md:items-center text-left md:text-center"
              variants={itemVariants}
            >
              <h2 className="text-lg font-bold text-white mb-4">Sell</h2>
              <div className="flex flex-col items-start md:items-center gap-3 text-sm">
                <Link
                  to="/vendor/register"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Become a Vendor
                </Link>
                <Link
                  to="/vendor/login"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Vendor Login
                </Link>
                <Link
                  to="/vendor/faq"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Selling FAQ
                </Link>
                <Link
                  to="/vendor/pricing"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Pricing
                </Link>
              </div>
            </motion.div>
            {/* Column 3: Support */}
            <motion.div
              className="flex flex-col items-start md:items-center text-left md:text-center"
              variants={itemVariants}
            >
              <h2 className="text-lg font-bold text-white mb-4">Support</h2>
              <div className="flex flex-col items-start md:items-center gap-3 text-sm">
                <Link
                  to="/help"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Help Center
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Contact Us
                </Link>
                <Link
                  to="/privacy"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-cyan-300 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </div>
            </motion.div>
            {/* Column 4: Connect */}
            <motion.div
              className="flex flex-col items-start md:items-center text-left md:text-center"
              variants={itemVariants}
            >
              <h2 className="text-lg font-bold text-white mb-4">Connect</h2>
              <div className="flex items-center gap-6 text-sm">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, color: '#00e5ff' }}
                  transition={{ duration: 0.3 }}
                  className="text-cyan-200"
                >
                  <GitHub className="w-8 h-8" />
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, color: '#00e5ff' }}
                  transition={{ duration: 0.3 }}
                  className="text-cyan-200"
                >
                  <Twitter className="w-8 h-8" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, color: '#00e5ff' }}
                  transition={{ duration: 0.3 }}
                  className="text-cyan-200"
                >
                  <LinkedIn className="w-8 h-8" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            className="text-sm text-cyan-200 pt-10 border-t border-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p>
              © {new Date().getFullYear()} E-Shop. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// Make sure to export it as default if this is the only thing in the file
export default LandingPage;

