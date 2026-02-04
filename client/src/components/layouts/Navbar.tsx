import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { MaterialIcon, NotificationDropdown, ProfileDropdown, Image, Button } from "../ui";
import { useAuth } from "../../features/auth";
import BrandLogo from "../../assets/Logo MRF.png";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, siteName } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface border-b border-border transition-colors duration-200">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Mobile Sidebar Toggle */}
            <Button
              variant="ghost"
              onClick={onMenuClick}
              className="p-2 mr-2 text-muted rounded-lg sm:hidden hover:bg-main-bg focus:outline-none">
              <MaterialIcon iconName="menu" />
            </Button>
            <Link to="/app/dashboard" className="flex gap-3 items-center">
              <Image src={BrandLogo} alt="Brand Logo" aspectRatio="aspect-square" containerClassName="max-h-8 max-w-8"/>
              <span className="text-main-text font-black text-lg tracking-tighter uppercase italic hidden sm:block">{siteName}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => toggleDarkMode()}
              className="p-2 text-muted rounded-lg hover:bg-main-bg transition-all active:scale-95"
              aria-label="Toggle Dark Mode">
              <MaterialIcon 
                iconName={darkMode ? "light_mode" : "dark_mode"} 
                className="text-primary"
              />
            </button>
            <NotificationDropdown/>
            <ProfileDropdown user={user}/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;