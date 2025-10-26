import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate, // Import useNavigate
  useLocation, // Import useLocation
} from "react-router-dom"; // Use react-router-dom instead of react-router

import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReduxProvider from "./redux/reduxProvider";
import { useEffect } from "react"; // Import useEffect

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Make sure VITE_CLIENT_ID is in your .env file */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID || ""}>
          <ReduxProvider>
            {children}
            <ScrollRestoration />
            <Scripts />
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const vendorId = localStorage.getItem("vendorId");
    const adminId = localStorage.getItem("adminId");
    const currentPath = location.pathname;

    // --- Redirection Logic ---
    
    // Pages that logged-in users should NOT be redirected away from
    const allowedPaths = [
        "/customer_login", 
        "/customer_signup", 
        "/vendor_login", 
        "/vendor_signup", 
        "/admin_login",
        "/vendor_pending" // Don't redirect away from pending page
    ];
    
    // If user is on a login/signup page, don't redirect yet
    if (allowedPaths.includes(currentPath)) {
        return; 
    }

    // Check for logged-in user and redirect if not already in their dashboard area
    if (userId && !currentPath.startsWith("/customer_dashboard")) {
      console.log("Redirecting to customer dashboard...");
      navigate("/customer_dashboard", { replace: true });
    } else if (vendorId && !currentPath.startsWith("/vendor_dashboard") && currentPath !== "/vendor_pending") {
       // Note: Vendor layout handles pending/rejected status check, 
       // so we just redirect to the main vendor dashboard entry point here.
      console.log("Redirecting to vendor dashboard...");
      navigate("/vendor_dashboard", { replace: true });
    } else if (adminId && !currentPath.startsWith("/admin_dashboard")) {
      console.log("Redirecting to admin dashboard...");
      navigate("/admin_dashboard", { replace: true });
    }
    // If none of the IDs exist and user is not on an allowed path, 
    // you might want to redirect them to a default page like home or login,
    // but for now, we only redirect logged-in users.

  }, [location, navigate]); // Re-run effect if location changes

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          style: {
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      {/* Outlet renders the matched route component */}
      <Outlet /> 
    </>
  );
}

// ErrorBoundary remains the same
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // ... (existing ErrorBoundary code) ...
   let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded mt-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}