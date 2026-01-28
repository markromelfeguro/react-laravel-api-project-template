import React from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialIcon from "../ui/MaterialIcon";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", path: "/app/dashboard" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-surface border-r border-border sm:translate-x-0 
      ${isOpen ? "translate-x-0 shadow-main" : "-translate-x-full"}`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
        
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-primary text-surface shadow-md" 
                      : "text-main-text hover:bg-main-bg"
                  }`}
                  >
                  <MaterialIcon
                    iconName={item.icon}
                    className={`transition-colors ${
                      isActive 
                        ? "text-surface" 
                        : "text-muted group-hover:text-primary"
                    }`} //
                  />
                  <span className={`ml-3 ${isActive ? "font-bold" : ""}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;