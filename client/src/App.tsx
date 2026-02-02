import { RouterProvider } from "react-router-dom";
import { useAuth } from "./features/auth";
import { LoadingSpinner } from "./components/ui";
import { routers } from "./routes/routes";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-main-bg flex items-center justify-center z-9999">
        <LoadingSpinner 
          size="xlg" 
          text="Initializing MRF Core"
          color="primary"
        />
      </div>
    );
  }

  return <RouterProvider router={routers} />;
};

export default App;