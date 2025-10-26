import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { 
    CircularProgress, 
    Button, 
    Chip, 
    Box, 
    Tabs, 
    Tab   
} from '@mui/material';
import { CheckCircleOutline, CancelOutlined, HourglassTop, List } from '@mui/icons-material';
import { getAllVendors, updateVendorStatusLocally } from '~/redux/actions'; 

// Vendor interface
interface Vendor {
  _id: string;
  shopName: string;
  name: string; 
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string; 
}

type VendorStatusFilter = 'all' | 'Pending' | 'Approved' | 'Rejected';

export default function AdminManageVendors() {
  const dispatch = useDispatch(); 
  
  // --- SELECTORS --- 
  // Get vendors, default to empty array if state.reducer or state.reducer.allVendors is missing
  const allVendors = useSelector((state) => state.reducer?.allVendors || []); 
  // Get loading state, default to true if state.reducer or state.reducer.userLoading is missing
  const loading = useSelector((state) => state.reducer?.userLoading ?? true); 
  
  const [error, setError] = useState<string | null>(null); 
  const [currentTab, setCurrentTab] = useState<VendorStatusFilter>('all'); 

  // --- DATA FETCHING ---
  // Fetch data only on component mount
  useEffect(() => {
    dispatch(getAllVendors());
  }, [dispatch]); 

  // --- FILTERING LOGIC ---
  const filteredVendors = useMemo(() => {
    // Crucial: Ensure allVendors is actually an array before filtering
    if (!Array.isArray(allVendors)) {
        console.warn("allVendors is not an array:", allVendors); // Log if it's not an array
        return []; // Return empty array to prevent errors
    }
    if (currentTab === 'all') {
      return allVendors;
    }
    return allVendors.filter((vendor: Vendor) => vendor.status === currentTab); 
  }, [allVendors, currentTab]);

  // --- EVENT HANDLERS ---
  const handleTabChange = (event: React.SyntheticEvent, newValue: VendorStatusFilter) => {
    setCurrentTab(newValue);
  };

  const handleUpdateStatus = async (vendorId: string, newStatus: 'Approved' | 'Rejected') => {
    const action = newStatus === 'Approved' ? 'approve' : 'reject';
    const loadingToastId = toast.loading(`Updating status to ${newStatus}...`);
    setError(null); 
    
    try {
      // API Call
      await axios.put(`http://localhost:5000/api/admin/vendors/${action}/${vendorId}`);
      // Dispatch action to update Redux state immediately
      dispatch(updateVendorStatusLocally(vendorId, newStatus)); 
      toast.success(`Vendor ${newStatus}.`, { id: loadingToastId });
    } catch (err: any) {
      console.error(`Error ${action}ing vendor:`, err);
      const errorMsg = err.response?.data?.message || `Failed to ${action} vendor.`;
      setError(errorMsg); 
      toast.error(errorMsg, { id: loadingToastId });
    }
  };

  // --- UI HELPERS ---
  const getStatusChip = (status: Vendor['status']) => {
     switch (status) {
      case 'Pending':
        return <Chip label="Pending" color="warning" size="small" icon={<HourglassTop />} />;
      case 'Approved':
        return <Chip label="Approved" color="success" size="small" icon={<CheckCircleOutline />} />;
      case 'Rejected':
        return <Chip label="Rejected" color="error" size="small" icon={<CancelOutlined />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // --- RENDER ---
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Vendors</h1>

      {/* --- Tabs --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3, backgroundColor: 'white', borderRadius: '8px', boxShadow: 1 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          aria-label="Vendor status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<List />} iconPosition="start" label="All" value="all" />
          <Tab icon={<HourglassTop />} iconPosition="start" label="Pending" value="Pending" />
          <Tab icon={<CheckCircleOutline />} iconPosition="start" label="Approved" value="Approved" />
          <Tab icon={<CancelOutlined />} iconPosition="start" label="Rejected" value="Rejected" />
        </Tabs>
      </Box>

      {/* --- Conditional Rendering: Loading -> Error -> Content --- */}
      {loading ? ( // Check loading state FIRST
        <div className="flex justify-center items-center py-10">
          <CircularProgress />
        </div>
      ) : error ? ( // Then check for errors
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : ( // Only render table if not loading and no error
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]"> 
              <thead className="bg-gray-50">
                 <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Check filteredVendors length *after* confirming it's an array */}
                {filteredVendors.length === 0 ? ( 
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {/* Adjust message based on whether the base list is empty */}
                      {allVendors.length === 0 ? "No vendors found." : `No vendors found with status "${currentTab}".`}
                    </td>
                  </tr>
                ) : (
                  filteredVendors.map((vendor: Vendor) => ( 
                    <tr key={vendor._id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.shopName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vendor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vendor.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusChip(vendor.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {vendor.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleOutline />}
                              onClick={() => handleUpdateStatus(vendor._id, 'Approved')}
                              sx={{ textTransform: 'none', fontSize: '0.8rem', padding: '4px 8px' }} 
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<CancelOutlined />}
                              onClick={() => handleUpdateStatus(vendor._id, 'Rejected')}
                              sx={{ textTransform: 'none', fontSize: '0.8rem', padding: '4px 8px' }} 
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                           <span className="text-gray-400 text-xs italic">
                                {vendor.status === 'Approved' ? 'Already Approved' : 'Already Rejected'}
                           </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}