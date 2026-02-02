import React, { useState } from "react";
import { Input, Select, Button, FileUpload, PasswordInput, MaterialIcon } from "../../../components/ui";
import type { User } from "../../users/types/user.types";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: any;  
  isUploading?: boolean;
  uploadProgress?: number;
}

const ValidationItem = ({ label, isMet }: { label: string; isMet: boolean }) => (
  <div className={`flex items-center gap-2 transition-all duration-300 ${isMet ? 'text-green-500' : 'text-muted/40'}`}>
    <MaterialIcon 
      iconName={isMet ? "check_circle" : "radio_button_unchecked"} 
      size={14} 
      className={isMet ? "scale-110 transition-transform" : ""}
    />
    <span className="text-[10px] font-black uppercase italic tracking-wider">
      {label}
    </span>
  </div>
);

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel, isLoading, errors = {}, isUploading, uploadProgress }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "user",
    password: "",
    password_confirmation: "",
  });
  
  const [avatar, setAvatar] = useState<File | null>(null);

  const requirements = [
    { label: "8-16 Characters", met: formData.password.length >= 8 && formData.password.length <= 16 },
    { label: "Uppercase (A-Z)", met: /[A-Z]/.test(formData.password) },
    { label: "Lowercase (a-z)", met: /[a-z]/.test(formData.password) },
    { label: "Number (0-9)", met: /[0-9]/.test(formData.password) },
    { label: "Special (@#$%!)", met: /[@#$%!]/.test(formData.password) },
    { label: "Passwords Match", met: formData.password !== "" && formData.password === formData.password_confirmation },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("role", formData.role);
    
    if (formData.password) {
        data.append("password", formData.password);
        data.append("password_confirmation", formData.password_confirmation);
    }
    if (avatar) data.append("avatar", avatar);
    if (initialData) data.append("_method", "PUT");

    await onSubmit(data);
  };

  const existingAvatar = initialData?.profile?.avatar ? `${import.meta.env.VITE_STORAGE_URL}/${initialData.profile.avatar}` : null;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 animate-reveal">
      <div className="bg-surface p-8 rounded-[2.5rem] border border-border shadow-main space-y-6">
        
       <FileUpload 
          label="Profile Photo"
          name="avatar"
          accept="image/jpeg,png,jpg"
          previewUrl={existingAvatar}
          error={errors.avatar?.[0]}
          onFileSelect={(files: File[]) => {
            if (files.length > 0) setAvatar(files[0]);
          }}
          isUploading={isUploading}
          progress={uploadProgress}
        />

        <Input
          label="Full Name"
          placeholder="e.g. Mark Romel"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name?.[0]}
          fullWidth
        />

        <Input
          label="Email Address"
          placeholder="example@gmail.com"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email?.[0]}
          fullWidth
        />

        <Select
          label="System Role"
          options={[
            { label: "Superadmin", value: "superadmin" },
            { label: "Admin", value: "admin" },
            { label: "Customer", value: "customer" },
          ]}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'superadmin' | 'admin' | 'customer' })}
          error={errors.role?.[0]}
          fullWidth
        />

        {/* Security Section */}
        <div className="h-px bg-border/50 my-2" />
        
        <PasswordInput
          label={initialData ? "New Password (Leave blank to skip)" : "Account Password"}
          name="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password?.[0]}
          fullWidth
        />

        <PasswordInput
          label="Confirm Password"
          name="password_confirmaton"
          value={formData.password_confirmation}
          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
          error={errors.confirmation?.[0]}
          fullWidth
        />

        {(formData.password || !initialData) && (
          <div className="grid grid-cols-2 gap-2 ml-1 p-4 bg-main-bg/20 rounded-2xl border border-border/30 animate-in fade-in slide-in-from-top-2">
            {requirements.map((req, i) => (
              <ValidationItem key={i} label={req.label} isMet={req.met} />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          isLoading={isLoading} 
          loadingType="loop" 
          loadingText={`${initialData ? "Updating record..." : "Creating user..."}`} 
          iconName="save"
        >
          {initialData ? "Update Record" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;