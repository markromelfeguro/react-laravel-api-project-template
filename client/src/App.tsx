import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth, ProtectedRoute, RoleGuard } from "./features/auth";
import { LoadingSpinner } from "./components/ui";
import WithSuspense from "./utils/WithSuspense";
import NotFoundPage from "./pages/404";

//PAGES
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Dashboard = React.lazy(() => import("./pages/dashboards/Dashboard"))

const routers = createBrowserRouter([
  { 
    path: "/", 
    element: WithSuspense(Welcome),
    handle: { breadcrumb: "Home" }
  },
  { path: "/login", element: WithSuspense(Login) },
  
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Dashboard />,
        children: [
          { 
            path: "dashboard", 
            element: WithSuspense(Dashboard),
            handle: { breadcrumb: "Dashboard" } 
          },
          {
            element: <RoleGuard allowedRoles={['superadmin']} />,
            children: [
              { 
                path: "settings", 
                element: <div>Admin Settings</div>,
                handle: { breadcrumb: "Settings" } 
              },
            ]
          }
        ]
      }
    ]
  },

  { path: "*", element: <NotFoundPage /> },
]);

const App = () => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="fixed inset-0 bg-main-bg flex items-center justify-center z-[9999">
        <LoadingSpinner 
          size="xlg" 
          logo="/react-logo.png"
          text="Initializing MRF Core"
          color="primary"
        />
      </div>
    );
  }

  return <RouterProvider router={routers} />;
};

export default App;