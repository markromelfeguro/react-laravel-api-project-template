import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, PasswordInput, MaterialIcon } from '../../../components/ui';
import { changePasswordSchema, type ChangePasswordInput } from '../schema/auth.schema';
import AuthService from '../api/AuthService';
import { notify } from '../../../utils/notify';

interface Props {
  isOpen: boolean;
  onClose: () => void;
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

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset, 
    setError, 
    watch 
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange"
  });

  const passwordValue = watch("password") || "";
  const confirmationValue = watch("password_confirmation") || "";

  // Requirements logic matching base on auth zod schema
  const requirements = [
    { label: "8-16 Characters", met: passwordValue.length >= 8 && passwordValue.length <= 16 },
    { label: "Uppercase (A-Z)", met: /[A-Z]/.test(passwordValue) },
    { label: "Lowercase (a-z)", met: /[a-z]/.test(passwordValue) },
    { label: "Number (0-9)", met: /[0-9]/.test(passwordValue) },
    { label: "Special (@#$%!)", met: /[@#$%!]/.test(passwordValue) },
    { label: "Passwords Match", met: passwordValue !== "" && passwordValue === confirmationValue },
  ];

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      const response = await AuthService.changePassword(data);
      notify.success(response.message || "Password updated successfully");
      reset();
      onClose();
    } catch (error: any) {
      const errorData = error.response?.data;
      
      if (errorData?.errors) {
        Object.keys(errorData.errors).forEach((key) => {
          setError(key as any, { message: errorData.errors[key][0] });
        });
      }
      
      notify.error(errorData?.message || "An unexpected error occurred");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Security Update"
      size="md"
      primaryAction={{
        label: "Save Changes",
        onClick: handleSubmit(onSubmit),
        isLoading: isSubmitting,
        iconName: "verified_user"
      }}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
    >
      <div className="flex flex-col gap-5 py-2">
        <PasswordInput
          label="Current Password"
          {...register("current_password")}
          error={errors.current_password?.message}
          fullWidth
        />
        
        <div className="h-px bg-border/50 my-2" />
        
        <PasswordInput
          label="New Password"
          {...register("password")}
          error={errors.password?.message} 
          fullWidth
        />

        <PasswordInput
          label="Confirm Password"
          {...register("password_confirmation")}
          error={errors.password_confirmation?.message}
          fullWidth
        />

        <div className="flex flex-col gap-3">
          {/* Real-time Checklist */}
          <div className="grid grid-cols-2 gap-2 ml-1 p-3 bg-main-bg/20 rounded-2xl border border-border/30">
            {requirements.map((req, i) => (
              <ValidationItem key={i} label={req.label} isMet={req.met} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
