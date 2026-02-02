import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, RoleGuard } from "../features/auth";
import WithSuspense from "../utils/WithSuspense";
import NotFoundPage from "../pages/404";
import { PATHS } from "./path";

// PAGE LAZY LOADING
const Welcome = React.lazy(() => import("../pages/Welcome"));
const Docs = React.lazy(() => import("../pages/Docs"));
const Login = React.lazy(() => import("../pages/auth/Login"));

// AUTHENTICATED PAGE
const Dashboard = React.lazy(() => import("../pages/dashboards/Dashboard"));
const UserManagement = React.lazy(() => import("../pages/admin/users/UserManagement"));
const UserConfig = React.lazy(() => import("../pages/admin/users/UserConfig"));
const MyProfile = React.lazy(() => import("../pages/profile/MyProfile"));

export const routers = createBrowserRouter([
  { 
    path: PATHS.HOME, 
    element: WithSuspense(Welcome),
    handle: { breadcrumb: "Home" }
  },
  { 
    path: PATHS.DOCS, 
    element: WithSuspense(Docs),
    handle: { breadcrumb: "Docs" }
  },
  { 
    path: PATHS.LOGIN, 
    element: WithSuspense(Login) 
  },
  {
    path: PATHS.APP.ROOT,
    element: <ProtectedRoute />,
    children: [
      {
        path: PATHS.APP.DASHBOARD,
        element: WithSuspense(Dashboard),
        handle: { breadcrumb: "Dashboard" }
      },
      {
        path: PATHS.APP.USER_MANAGEMENT.ROOT,
        element: <RoleGuard allowedRoles={["superadmin", "admin"]} />,
        children: [
          {
            index: true,
            element: WithSuspense(UserManagement),
            handle: { breadcrumb: "User Management" }
          },
          {
            path: PATHS.APP.USER_MANAGEMENT.CREATE,
            element: WithSuspense(UserConfig),
            handle: { breadcrumb: "Create User" }
          },
          {
            path: PATHS.APP.USER_MANAGEMENT.EDIT,
            element: WithSuspense(UserConfig),
            handle: { breadcrumb: "Edit User" }
          },
        ]
      },
      {
        path: PATHS.APP.MY_PROFILE,
        element: WithSuspense(MyProfile),
        handle: { breadcrumb: "My Profile" }
      }
    ]
  },
  { 
    path: "*", 
    element: <NotFoundPage /> 
  },
]);