import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CircularProgress, Avatar } from '@mui/material'; // Using Avatar for customer picture

// Define an interface for the Customer data structure
interface Customer {
  _id: string;
  name: string;
  email: string;
  picture?: string; // Optional picture URL
  createdAt: string; // Assuming timestamps: true
  authMethod: 'email' | 'google';
}

export default function AdminManageCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch customers from the backend
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      // API endpoint to fetch all customers
      const response = await axios.get(`http://localhost:5000/api/admin/customers`); 
      setCustomers(response.data.customers || []); // Assuming backend returns { customers: [...] }
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      const errorMsg = err.response?.data?.message || "Failed to fetch customers.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers when the component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Customers</h1>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <CircularProgress />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signup Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                           <Avatar 
                             src={customer.picture} 
                             alt={customer.name} 
                             sx={{ width: 32, height: 32 }} // MUI Avatar styling
                           />
                           {customer.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{customer.authMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(customer.createdAt).toLocaleDateString()} {/* Format date */}
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