import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../features/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../../utils/notify';

import { 
  Button,  
  Input,
  Checkbox,
} from '../../../components/ui';

const loginSchema = z.object({
  login_credential: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember_me: z.boolean(), 
});

type LoginFields = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors } 
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login_credential: "",
      password: "",
      remember_me: false,
    }
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.login_credential, data.password, data.remember_me);
      navigate('/app/dashboard')
      notify.success("Login Successfully.");
    } catch (error: any) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors;
        
        Object.keys(serverErrors).forEach((key) => {
          setError(key as keyof LoginFields, {
            type: "server",
            message: serverErrors[key][0],
          });
        });
      }
      console.error("Login component error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <Input 
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          iconName="mail"
          error={errors.login_credential?.message}
          {...register("login_credential")} 
          fullWidth
        />

        <div className="space-y-2">
          <Input 
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            iconName="lock"
            error={errors.password?.message}
            {...register("password")} 
            fullWidth
          />
          
          <div className="flex justify-end px-1">
            <Checkbox 
              size='sm'
              label="Show Password"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <Checkbox 
          size='sm'
          label="Remember me" 
          id="remember"
          {...register("remember_me")} 
        />
        
        <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
          Forgot Password?
        </button>
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        size="md"
        className="w-full mt-2"
        isLoading={isSubmitting}
        iconName="login"
        iconPosition="right"
      >
        Sign In
      </Button>
    </form>
  );
};