import type { Dispatch } from "redux";
import axios from "axios";

// --- Action Types ---
const CURRENT_USER = "CURRENT_USER";
const LOGOUT = "LOGOUT";
const USER_LOADING = "USER_LOADING";
const SET_UNREAD_COUNT = "SET_UNREAD_COUNT";
export const UPDATE_USER = "UPDATE_USER";
const VENDOR = "VENDOR";
const ADMIN = "ADMIN";
const ALL_VENDORS = "ALL_VENDORS"; // New action type
const UPDATE_VENDOR_STATUS = "UPDATE_VENDOR_STATUS"; // New action type

// --- Existing Actions (getUser, logout, getVendor, getAdmin) ---
export const getUser =
  (userId: string): any =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });
      const data = await axios.get(
        `http://localhost:5000/api/customer/${userId}`
      );
      if (data) {
        dispatch({ type: CURRENT_USER, payload: data?.data?.user });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: CURRENT_USER, payload: null });
    } finally {
      dispatch({ type: USER_LOADING, payload: false });
    }
  };

export const logout = (): any => async (dispatch: Dispatch) => {
  try {
    localStorage.removeItem("userId");
    localStorage.removeItem("vendorId"); // Also remove vendor/admin IDs
    localStorage.removeItem("adminId");
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const getVendor =
  (vendorId: string): any => // Renamed userId to vendorId for clarity
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });
      const data = await axios.get(
        `http://localhost:5000/api/vendor/${vendorId}` // Use vendorId
      );
      if (data) {
        dispatch({ type: VENDOR, payload: data?.data?.vendor });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: VENDOR, payload: null });
    } finally {
      dispatch({ type: USER_LOADING, payload: false });
    }
  };

export const getAdmin =
  (adminId: string): any => // Renamed userId to adminId
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: USER_LOADING, payload: true });
      const data = await axios.get(
        `http://localhost:5000/api/admin/${adminId}` // Use adminId
      );
      if (data) {
        dispatch({ type: ADMIN, payload: data?.data?.admin });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: ADMIN, payload: null });
    } finally {
      dispatch({ type: USER_LOADING, payload: false });
    }
  };

// --- NEW ACTIONS for Admin Vendor Management ---

// Action to fetch all vendors
export const getAllVendors = (): any => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: USER_LOADING, payload: true }); // Use USER_LOADING or a new ADMIN_LOADING
    const response = await axios.get(`http://localhost:5000/api/admin/vendors`);
    dispatch({ type: ALL_VENDORS, payload: response.data.vendors || [] });
  } catch (error: any) {
    console.error("Error fetching all vendors:", error);
    toast.error(error.response?.data?.message || "Failed to fetch vendors.");
    dispatch({ type: ALL_VENDORS, payload: [] }); // Clear vendors on error
  } finally {
    dispatch({ type: USER_LOADING, payload: false });
  }
};

// Action to update a vendor's status (called after successful API call)
// This only updates the Redux state, the API call happens in the component
export const updateVendorStatusLocally = (vendorId: string, newStatus: 'Approved' | 'Rejected'): any => (dispatch: Dispatch) => {
    dispatch({ 
        type: UPDATE_VENDOR_STATUS, 
        payload: { vendorId, newStatus } 
    });
};