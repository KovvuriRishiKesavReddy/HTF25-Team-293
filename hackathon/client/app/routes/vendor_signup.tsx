import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";

// Icons for the form
import Person from "@mui/icons-material/Person";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Phone from "@mui/icons-material/Phone";
import Store from "@mui/icons-material/Store";
import Business from "@mui/icons-material/Business"; // Re-using for Address
import Category from "@mui/icons-material/Category";
import FileUpload from "@mui/icons-material/FileUpload";
import CheckCircle from "@mui/icons-material/CheckCircle";

export default function VendorSignup() {
  // Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Shop Info
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [shopAddress, setShopAddress] = useState(""); // Simplified Address

  // Files
  const [shopLogo, setShopLogo] = useState<File | null>(null); // Optional

  // UI State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Animation variants for staggered list
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    // --- Validation ---
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !shopName ||
      !shopCategory ||
      !shopAddress 
    ) {
      const msg = "Please fill in all required fields.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (password.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setError(msg);
      toast.error(msg);
      return;
    }
    // --- End Validation ---

    setLoading(true);

    // Use FormData to send text and files
    const formData = new FormData();
    // Personal
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    // Shop
    formData.append("shopName", shopName);
    formData.append("shopCategory", shopCategory);
    formData.append("shopAddress", shopAddress); // Simplified address field

    // Optional fields
    if (shopLogo) formData.append("shopLogo", shopLogo);

    try {
      // Assumed vendor signup route
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/vendor/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Vendor signup response:", res);

      if (res.status === 201) {
        const msg = "Application submitted! You will be notified upon approval.";
        setSuccess(msg);
        toast.success(msg);
        setIsSubmitted(true); // Show success message instead of form
      }
    } catch (error: any) {
      console.log(error);
      const msg =
        error?.response?.data?.message ||
        "Failed to submit application. Please try again later.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-4 sm:p-6 flex items-center justify-center relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CircularProgress size={60} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 hover:shadow-3xl">
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col bg-white overflow-y-auto max-h-[100vh] pt-4 md:pt-0">
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Application Received!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {success}
              </p>
              <p className="text-gray-500">
                Our team will review your details. You can close this page.
              </p>
              <Link
                to="/"
                className="mt-8 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700"
              >
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.h2
                className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 text-center tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Vendor Registration
              </motion.h2>
              <motion.p
                className="text-gray-500 text-center mb-8 text-sm sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Apply to become a seller on E-Shop.
              </motion.p>
              
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    role="alert"
                  >
                    <strong className="font-semibold">Error: </strong>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* --- Personal Info --- */}
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Info (Owner)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="John Doe" />
                      <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <div className="relative">
                      <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="you@example.com" />
                      <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <input type="tel" id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="+1 555-123-4567" />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {/* Password fields remain the same */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} id="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-10 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="Min. 8 characters" />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showPassword ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                    <div className="relative">
                      <input type={showCPassword ? "text" : "password"} id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-10 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="••••••••" />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button type="button" onClick={() => setShowCPassword(!showCPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {showCPassword ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- Shop Info --- */}
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 pt-4">Shop Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1.5">Shop Name *</label>
                    <div className="relative">
                      <input type="text" id="shopName" required value={shopName} onChange={(e) => setShopName(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="My Awesome Store" />
                      <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="shopCategory" className="block text-sm font-medium text-gray-700 mb-1.5">Shop Category *</label>
                    <div className="relative">
                      <select id="shopCategory" required value={shopCategory} onChange={(e) => setShopCategory(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50 appearance-none"
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing & Fashion</option>
                        <option value="grocery">Grocery</option>
                        <option value="home">Home & Kitchen</option>
                        <option value="beauty">Beauty & Health</option>
                        <option value="other">Other</option>
                      </select>
                      <Category className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                       <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span> {/* Dropdown arrow */}
                    </div>
                  </div>
                  {/* Simplified Single Address Field */}
                  <div className="md:col-span-2">
                    <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-1.5">Shop Address *</label>
                    <div className="relative">
                      <input type="text" id="shopAddress" required value={shopAddress} onChange={(e) => setShopAddress(e.target.value)} disabled={loading}
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-500 bg-gray-50"
                        placeholder="123 Main St, City, Country, Pincode" />
                      <Business className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {/* Optional Shop Logo */}
                  <div className="md:col-span-2"> 
                    <label htmlFor="shopLogo" className="block text-sm font-medium text-gray-700 mb-1.5">Shop Logo (Optional)</label>
                    <label className="w-full flex items-center px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:bg-white cursor-pointer">
                      <FileUpload className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500 truncate">{shopLogo ? shopLogo.name : "Click to upload image"}</span>
                      <input type="file" id="shopLogo" accept="image/*" onChange={(e) => handleFileChange(e, setShopLogo)} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* --- Submit Button --- */}
                <div className="pt-4 space-y-4">
                  <motion.button
                    onClick={handleSignup}
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 flex items-center justify-center ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} className="mr-2 text-white" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div
                className="mt-6 text-center text-sm text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Already have a vendor account?{" "}
                <Link
                  to="/vendor_login"
                  className={`font-medium text-purple-600 hover:text-purple-500 transition duration-200 ${
                    loading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  Log in
                </Link>
              </motion.div>
            </>
          )}

        </div>
        
        {/* === UPDATED RIGHT PANEL === */}
        <div className="hidden md:block md:w-1/2 p-10 lg:p-12 bg-gradient-to-br from-purple-600 to-indigo-700 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          
          <motion.h3 
              className="relative text-3xl sm:text-4xl font-extrabold mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
              Become an E-Shop Partner
          </motion.h3>
          
          <motion.p 
              className="relative text-lg leading-relaxed opacity-90 drop-shadow mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
              Complete this application to start selling on our marketplace.
          </motion.p>

          <motion.div 
              className="relative space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
              }}
          >
              <h4 className="text-xl font-semibold mb-3">Please provide:</h4>
              
              <motion.div className="flex items-start" variants={itemVariants}>
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg opacity-90">Full Name, Email, Password, Phone Number</span>
              </motion.div>
              
              <motion.div className="flex items-start" variants={itemVariants}>
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg opacity-90">Shop Name, Category, Address</span>
              </motion.div>

              <motion.div className="flex items-start" variants={itemVariants}>
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-lg opacity-90">Shop Logo (Optional)</span>
              </motion.div>
          </motion.div>

          <motion.div 
              className="relative mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
          >
              <h4 className="text-xl font-semibold mb-3">Approval Process:</h4>
              <p className="text-lg opacity-90 leading-relaxed">
                  Once submitted, your application will be <strong className="font-semibold text-yellow-300">"Pending Review"</strong>. Our team will verify your details, and you'll receive an email notification upon approval.
              </p>
          </motion.div>
        </div>
        {/* === END OF NEW RIGHT PANEL === */}

      </div>
    </div>
  );
}