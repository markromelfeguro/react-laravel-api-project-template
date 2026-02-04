import React from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialIcon from "../ui/MaterialIcon";
import { PATHS } from "../../routes/path";
import { useAuth } from "../../features/auth";

// Define the shape of a single menu item
interface MenuItem {
  name: string;
  icon: string;
  path: string;
  roles?: string[]; // Optional: if omitted, everyone sees it
}

// Define the shape of a menu group
interface MenuGroup {
  group: string;
  roles?: string[]; // Optional: hide the whole section
  items: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Explicitly type the array as MenuGroup[]
  const menuGroups: MenuGroup[] = [
    {
      group: "Main",
      items: [
        { 
          name: "Dashboard", 
          icon: "dashboard", 
          path: `${PATHS.APP.ROOT}/${PATHS.APP.DASHBOARD}` 
        },
        { 
          name: "User Management", 
          icon: "manage_accounts", 
          path: `${PATHS.APP.ROOT}/${PATHS.APP.USER_MANAGEMENT.ROOT}`,
          roles: ["admin", "superadmin"]
        },
      ],
    },
    {
      group: "System",
      roles: ["superadmin"], 
      items: [
        { 
          name: "System Config", 
          icon: "settings", 
          path: `${PATHS.APP.ROOT}/${PATHS.APP.SYSTEM.ROOT}` 
        },
        { 
          name: "Audit Logs", 
          icon: "change_history", 
          path: `${PATHS.APP.ROOT}/${PATHS.APP.SYSTEM.ROOT}/${PATHS.APP.SYSTEM.AUDIT_LOGS}` 
        },
        { 
          name: "Activity Logs", 
          icon: "history", 
          path: `${PATHS.APP.ROOT}/${PATHS.APP.SYSTEM.ROOT}/${PATHS.APP.SYSTEM.ACTIVITY_LOGS}` 
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-surface border-r border-border sm:translate-x-0 
      ${isOpen ? "translate-x-0 shadow-main" : "-translate-x-full"}`}
    >
      <div className="h-full px-4 pb-4 overflow-y-auto custom-scrollbar">
        {menuGroups
          // Filter groups by user role
          .filter(group => !group.roles || group.roles.includes(user?.role || ""))
          .map((group) => (
            <div key={group.group} className="mb-6">
              <h3 className="px-3 mb-2 text-[10px] font-black uppercase italic tracking-widest text-muted opacity-60">
                {group.group}
              </h3>
              
              <ul className="space-y-1.5 font-medium">
                {group.items
                  // Filter individual items by user role
                  .filter(item => !item.roles || item.roles.includes(user?.role || ""))
                  .map((item) => {
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