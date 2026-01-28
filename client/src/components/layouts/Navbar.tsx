import React from "react";
import { useTheme } from "../../context/ThemeContext";
import MaterialIcon from "../ui/MaterialIcon";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface border-b border-border transition-colors duration-200">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={onMenuClick}
              className="p-2 mr-2 text-muted rounded-lg sm:hidden hover:bg-main-bg focus:outline-none"
            >
              <MaterialIcon iconName="menu" />
            </button>
            <span className="text-xl font-bold text-main-text sm:text-2xl">
              ProjectTemplate
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => toggleDarkMode()}
              className="p-2 text-muted rounded-lg hover:bg-main-bg transition-all active:scale-95"
              aria-label="Toggle Dark Mode"
            >
              <MaterialIcon 
                iconName={darkMode ? "light_mode" : "dark_mode"} 
                className="text-primary"
              />
            </button>
            <MaterialIcon iconName="account_circle" className="text-muted cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;