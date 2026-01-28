import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../features/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../../utils/notify';

import { 
  Button,  
  Input,
  PasswordInput,
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
      navigate('/app/dashboard');
      notify.success("Login Successfully. Welcome back.");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <PasswordInput 
          label="Security Protocol"
          placeholder="••••••••"
          iconName="lock"
          error={errors.password?.message}
          {...register("password")} 
          fullWidth
        />
      </div>

      <div className="flex items-center justify-between px-1 pt-1">
        <Checkbox 
          size='xs'
          label="Remember Me" 
          id="remember"
          {...register("remember_me")} 
          className="opacity-80"
        />
        <Link to={"#"}>
          <span className="text-xs hover:underline font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors italic">
            Forgot password
          </span>
        </Link>
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        size="md"
        className="w-full mt-4"
        isLoading={isSubmitting}
        loadingType='loop'
        loadingText='Logging In...'
        iconName="vpn_key"
        iconPosition="right">
        Login
      </Button>
    </form>
  );
};