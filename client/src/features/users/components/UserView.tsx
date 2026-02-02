import React from "react";
import { MaterialIcon, Image } from "../../../components/ui";
import type { User } from "../types/user.types";

interface UserViewProps {
  user: User;
}

const UserView: React.FC<UserViewProps> = ({ user }) => {

  const userInitial = user.name.charAt(0).toUpperCase();
  const avatarUrl = user.profile?.avatar;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-main-bg/50 rounded-3xl border border-border">
        <div className="w-20 h-20 rounded-2xl border-2 border-primary/20 overflow-hidden bg-surface flex items-center justify-center">
          {avatarUrl && avatarUrl !== "" ? (
            <Image 
              src={`${import.meta.env.VITE_STORAGE_URL}/${avatarUrl}`} 
              alt={user.name} 
              aspectRatio='aspect-square'
            />
          ) : (
            <span className="text-3xl font-black text-primary italic">
              {userInitial}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-primary">
            {user.name}
          </h3>
          <p className="text-sm text-muted font-medium">{user.email}</p>
          <div className="mt-1">
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest bg-primary/10 ${user.role}`}>
                {user.role}
             </span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-surface border border-border rounded-2xl">
          <p className="text-[10px] font-black uppercase text-muted mb-1 flex items-center gap-1">
            <MaterialIcon iconName="smartphone" size={12} /> Contact Phone
          </p>
          <span className="text-sm font-bold italic text-main-text">
            {user.profile?.phone || "No phone listed"}
          </span>
        </div>
        <div className="p-4 bg-surface border border-border rounded-2xl">
          <p className="text-[10px] font-black uppercase text-muted mb-1 flex items-center gap-1">
            <MaterialIcon iconName="palette" size={12} /> Interface Theme
          </p>
          <span className="text-sm font-bold uppercase italic text-main-text">
            {user.profile?.theme || "System Default"}
          </span>
        </div>
      </div>

      {/* Bio Section */}
      <div className="p-5 bg-surface border border-border rounded-2xl">
        <p className="text-[10px] font-black uppercase text-muted mb-2 flex items-center gap-1">
          <MaterialIcon iconName="description" size={12} /> Professional Bio
        </p>
        <p className="text-sm italic leading-relaxed opacity-80 text-main-text">
          {user.profile?.bio || "This user hasn't added a bio yet."}
        </p>
      </div>

      <div className="flex justify-end items-center px-2">
        <p className="text-xs font-bold uppercase text-muted italic">
          Registered: {new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UserView;