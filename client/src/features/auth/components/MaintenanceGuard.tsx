import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AxiosInstance from "../../../api/AxiosInstance";
import { PATHS } from "../../../routes/path";

export const MaintenanceGuard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [maintenance, setMaintenance] = useState<boolean | null>(null);

  useEffect(() => {
    AxiosInstance.get('/system-configs')
      .then(res => {
        const mode = res.data.data.find((c: any) => c.key === 'maintenance_mode');
        setMaintenance(mode?.value === 'true' || mode?.value === '1');
      })
      .catch(() => setMaintenance(false));
  }, []);

  if (maintenance === null) return null;

  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin';

  if (maintenance && !isAdmin) {
    if (location.pathname !== PATHS.MAINTENANCE) {
      return <Navigate to={PATHS.MAINTENANCE} replace />;
    }
  }

  return <Outlet />;
};