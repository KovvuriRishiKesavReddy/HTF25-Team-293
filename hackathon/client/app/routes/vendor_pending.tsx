import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HourglassTop } from '@mui/icons-material';
import { useSelector } from 'react-redux';

export default function VendorPending() {

  const vendor = useSelector((state: any) => state.reducer.vendor);

  useEffect(()=> {
    if(vendor && vendor.status !== 'Pending'){
        // Redirect based on vendor status
        if(vendor.status === 'Approved'){
            window.location.href = '/vendor_dashboard';
        }

        if(vendor.status === 'Rejected'){
            window.location.href = '/vendor_pending'; // You can create a rejected page later
        }
    }
  },[vendor]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-10 bg-white rounded-lg shadow-xl max-w-lg">
        <HourglassTop className="text-yellow-500 mx-auto" style={{ fontSize: 60 }} />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Application Pending Review
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Thank you for applying to be a vendor on E-Shop! Your application is
          currently being reviewed by our team.
        </p>
        <p className="text-gray-600 mt-2">
          You will receive an email notification as soon as your account is
          approved. This usually takes 24-48 hours.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}