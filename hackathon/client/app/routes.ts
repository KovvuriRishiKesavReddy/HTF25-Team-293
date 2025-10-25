


import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("customer_login", "routes/customer_login.tsx"),
  route("customer_signup", "routes/customer_signup.tsx"),
  route("vendor_login", "routes/vendor_login.tsx"),
  route("vendor_signup", "routes/vendor_signup.tsx"),
  route("admin_login", "routes/admin_login.tsx"),

] satisfies RouteConfig;
