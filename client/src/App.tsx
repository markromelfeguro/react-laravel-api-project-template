import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { 
  useAuth, 
  // ProtectedRoute,
  // RoleGuard 
} from "./features/auth";

import WithSuspense from "./utils/WithSuspense";
import NotFoundPage from "./pages/404";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const Welcome = React.lazy(() => import("./pages/Welcome"));

const routers = createBrowserRouter([
  
  {
    path: "/",
    element: WithSuspense(Welcome),
  },

  // 4. Fallback: 404 Page
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