import { useAuth } from "../../features/auth";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui";
import { LoginForm } from "./components/LoginForm";
import { MaterialIcon } from "../../components/ui";

const LoginPage = () => {

  const { isLoggedIn, loading } = useAuth(); //

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg p-4">
      <div className="w-full max-w-md bg-surface rounded-xl shadow-xl border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <MaterialIcon iconName="lock" color="text-primary" />
          </div>
          <h1 className="text-2xl text-primary font-bold">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Don't have an account? <a href="#" className="text-blue-600 font-medium">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;