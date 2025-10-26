


import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("customer_login", "routes/customer_login.tsx"),
  route("customer_signup", "routes/customer_signup.tsx"),
  route("vendor_login", "routes/vendor_login.tsx"),
  route("vendor_signup", "routes/vendor_signup.tsx"),
  route("admin_login", "routes/admin_login.tsx"),

  route("customer_dashboard", "routes/customer_dashboard/layout.tsx", [
    index("routes/customer_dashboard/index.tsx"),
  ]),

  route("vendor_pending", "routes/vendor_pending.tsx"),

  route("vendor_dashboard", "routes/vendor_dashboard/layout.tsx", [
    index("routes/vendor_dashboard/index.tsx"), // Main stats
    route("products", "routes/vendor_dashboard/products.tsx"), // Manage products
    route("orders", "routes/vendor_dashboard/orders.tsx"),   // Manage orders
    // route("settings", "routes/vendor_dashboard/settings.tsx"), // Shop settings

    route("products/new", "routes/vendor_dashboard/products/new.tsx"), // <-- ADDED: Add new product page
  ]),

  route("admin_dashboard", "routes/admin_dashboard/layout.tsx", [
    index("routes/admin_dashboard/index.tsx"),          // Main stats
    route("vendors", "routes/admin_dashboard/vendors.tsx"),  // Manage vendors (approval)
    route("customers", "routes/admin_dashboard/customers.tsx"), // View customers
    // route("settings", "routes/admin_dashboard/settings.tsx"), // Admin settings
  ]),


] satisfies RouteConfig;
