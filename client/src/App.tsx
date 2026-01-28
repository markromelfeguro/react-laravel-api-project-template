import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth, ProtectedRoute, RoleGuard } from "./features/auth";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingSpinner } from "./components/ui";
import Logo from './assets/Logo MRF.png';
import WithSuspense from "./utils/WithSuspense";
import NotFoundPage from "./pages/404";

//PAGES
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Docs = React.lazy(() => import("./pages/Docs"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Dashboard = React.lazy(() => import("./pages/dashboards/Dashboard"));
const MyProfile = React.lazy(() => import("./pages/profile/MyProfile"));

const routers = createBrowserRouter([
  { 
    path: "/", 
    element: WithSuspense(Welcome),
    handle: { breadcrumb: "Home" }
  },
  { 
    path: "/docs", 
    element: WithSuspense(Docs),
    handle: { breadcrumb: "Docs" }
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
        ]
      },
      {
        path: "my-profile",
        element: WithSuspense(MyProfile),
        handle: { breadcrumb: "My Profile" }
      }
    ]
  },


  { path: "*", element: <NotFoundPage /> },
]);

const App = () => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <ThemeProvider>
        <div className="fixed inset-0 bg-main-bg flex items-center justify-center z-[9999">
          <LoadingSpinner 
            size="xlg" 
            logo={Logo}
            text="Initializing MRF Core"
            color="primary"
          />
        </div>
      </ThemeProvider>
    );
  }

  return <RouterProvider router={routers} />;
};

export default App;