import type { AnyAction } from "redux";

// --- Action Types ---
const CURRENT_USER = "CURRENT_USER";
const LOGOUT = "LOGOUT";
const USER_LOADING = "USER_LOADING";
const SET_UNREAD_COUNT = "SET_UNREAD_COUNT";
const UPDATE_USER = "UPDATE_USER";
const VENDOR = "VENDOR"; // Represents the currently logged-in vendor
const ADMIN = "ADMIN";   // Represents the currently logged-in admin
const ALL_VENDORS = "ALL_VENDORS"; // Represents the list fetched by admin
const UPDATE_VENDOR_STATUS = "UPDATE_VENDOR_STATUS"; // Action for admin updating a vendor

// --- Initial State ---
const initialState = {
  currentUser: null, // Logged-in customer
  vendor: null,      // Logged-in vendor
  admin: null,       // Logged-in admin
  allVendors: [],    // List of all vendors for admin view
  userLoading: true,
  unreadCount: 0,
};

// --- Reducer Logic ---
const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case VENDOR:
      return {
        ...state,
        vendor: action.payload, // Store logged-in vendor data
      };
    case ADMIN:
      return {
        ...state,
        admin: action.payload, // Store logged-in admin data
      };
     case ALL_VENDORS: // Handle fetching all vendors
      return {
        ...state,
        allVendors: action.payload,
      };
    case UPDATE_VENDOR_STATUS: // Handle updating a vendor's status in the list
      return {
        ...state,
        allVendors: state.allVendors.map((v: any) => // Assuming 'any' for now, replace with Vendor interface
          v._id === action.payload.vendorId 
            ? { ...v, status: action.payload.newStatus } 
            : v
        ),
      };
    case LOGOUT: // Clear all user types on logout
      return {
        ...initialState, // Reset to initial state might be better
        userLoading: false, // Keep loading state consistent
      };
    case USER_LOADING:
      return {
        ...state,
        userLoading: action.payload,
      };
    case SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
    case UPDATE_USER: // This seems customer-specific, might need renaming
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>;
export default reducer;