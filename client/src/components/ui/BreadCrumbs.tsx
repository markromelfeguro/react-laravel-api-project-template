import { Link, useLocation, useMatches } from "react-router-dom";
import { MaterialIcon } from "./MaterialIcon";

const Breadcrumbs = () => {
  const location = useLocation();
  const matches = useMatches();

  // Hide breadcrumbs on Welcome or Login pages
  if (location.pathname === "/" || location.pathname === "/login") return null;

  const crumbs = matches
    .filter((match: any) => Boolean(match.handle?.breadcrumb))
    .map((match: any) => ({
      label: match.handle.breadcrumb,
      path: match.pathname,
    }));

  // Check if we are currently on the dashboard to prevent double "Home/Dashboard" links
  const isDashboard = location.pathname === "/app/dashboard";

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 py-3 px-4 overflow-x-auto whitespace-nowrap transparent rounded-lg transition-colors">
      
      {/* Only clickable if we aren't already on the dashboard */}
      {isDashboard ? (
        <div className="flex items-center text-primary shrink-0">
          <MaterialIcon iconName="home" className="text-sm" />
          <span className="ml-2 font-bold text-main-text">Dashboard</span>
        </div>
      ) : (
        <Link to="/app/dashboard" className="flex items-center text-muted hover:text-primary transition-colors shrink-0">
          <MaterialIcon iconName="home" className="text-sm" />
        </Link>
      )}

      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        if (crumb.path === "/app/dashboard" || (crumb.path === "/" && index === 0)) {
            return null;
        }

        return (
          <div key={crumb.path} className="flex items-center shrink-0">
            <MaterialIcon 
              iconName="chevron_right" 
              className="text-sm text-muted mx-1" 
            />
            
            {isLast ? (
              <span className="text-main-text font-bold">
                {crumb.label}
              </span>
            ) : (
              <Link 
                to={crumb.path} 
                className="text-muted hover:text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;