import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { MaterialIcon } from '../ui';
import type { User } from '../../features/users/types/user.types';

const ProfileDropdown = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const avatarUrl = user?.profile?.avatar ? `${import.meta.env.VITE_STORAGE_URL}/${user.profile.avatar}` : null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-surface border border-border hover:border-primary transition-all duration-200 focus:outline-none overflow-hidden group shadow-main">
        {avatarUrl && !imgError ? (
          <img
            src={avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-main-text font-black italic text-lg">{initial}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 origin-top-right divide-y divide-border rounded-3xl bg-surface border border-border shadow-main focus:outline-none z-50 animate-reveal">
          
          <div className="px-5 py-4 flex items-center gap-4 bg-main-bg/30 rounded-t-3xl border-b border-border">
             <div className="w-12 h-12 rounded-2xl bg-primary text-surface flex items-center justify-center font-black italic text-xl shadow-main">
                {avatarUrl && !imgError ? (
                  <img
                  src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  initial
                )}
             </div>
             <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-black uppercase italic tracking-tighter text-main-text truncate">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                  Verified Identity
                </p>
             </div>
          </div>
          
          <div className="py-2">
            <Link 
              to="/app/my-profile" 
              className="flex items-center gap-3 px-5 py-3 text-sm text-main-text hover:bg-main-bg transition-colors group">
              <MaterialIcon iconName="account_circle" className="text-muted group-hover:text-primary transition-colors" />
              <span className="font-medium">My Profile</span>
            </Link>
          </div>
          
          <div className="py-2">
            <Link 
              to="/settings" 
              className="flex items-center gap-3 px-5 py-3 text-sm text-main-text hover:bg-main-bg transition-colors group">
              <MaterialIcon iconName="settings_suggest" className="text-muted group-hover:text-primary transition-colors" />
              <span className="font-medium">Settings & Security</span>
            </Link>
          </div>

          {/* Action Section */}
          <div className="py-2">
            <button 
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-bold group">
              <MaterialIcon iconName="logout" className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="uppercase italic tracking-tighter">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;