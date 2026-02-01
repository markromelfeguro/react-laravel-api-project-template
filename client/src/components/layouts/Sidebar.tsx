import React from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialIcon from "../ui/MaterialIcon";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuGroups = [
    {
      group: "Main",
      items: [
        { name: "Dashboard", icon: "dashboard", path: "/app/dashboard" },
        { name: "User Management", icon: "manage_accounts", path: "/app/user-management" },
      ],
    },
    {
      group: "System",
      items: [
        { name: "System Config", icon: "settings", path: "/app/settings" },
        { name: "Audit Logs", icon: "change_history", path: "/app/audit-logs" },
        { name: "Activity Logs", icon: "history", path: "/app/activity-logs" },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-surface border-r border-border sm:translate-x-0 
      ${isOpen ? "translate-x-0 shadow-main" : "-translate-x-full"}`}>
      <div className="h-full px-4 pb-4 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group) => (
          <div key={group.group} className="mb-6">
            <h3 className="px-3 mb-2 text-[10px] font-black uppercase italic tracking-widest text-muted opacity-60">
              {group.group}
            </h3>
            
            <ul className="space-y-1.5 font-medium">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-2.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-primary text-surface shadow-main scale-[1.02] z-10" 
                          : "text-main-text hover:bg-main-bg"
                      }`}
                    >
                      <MaterialIcon
                        iconName={item.icon}
                        className={`transition-colors ${
                          isActive 
                            ? "text-surface" 
                            : "text-muted group-hover:text-primary"
                        }`}
                      />
                      <span className={`ml-3 text-sm ${isActive ? "font-black italic uppercase tracking-tighter" : ""}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;