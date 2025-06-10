import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { 
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Form validation schema
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms & Conditions' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUserName = useAuthStore((state) => state.setUserName);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.info('Registration attempt:', data.email);
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
          terms_accepted: data.terms
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Registration failed');
        console.error('Registration failed:', errorData.detail || response.statusText);
      } else {
        const result = await response.json();
        setToken(result.access_token);
        setUserName(result.full_name);
        console.info('Registration successful:', data.email);
        navigate('/dashboard', { state: { from: 'register' } });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send the ID token to your FastAPI backend
      const response = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        setUserName(user.displayName);
        console.info('Registration successful:', user.email);
        navigate('/dashboard', { state: { from: 'google-signup' } });
      } else {
        const error = await response.json();
        setError(error.detail || "Google sign-up failed");
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 px-2 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Create your account</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded relative text-sm" role="alert">
              <span>{error}</span>
            </div>
          )}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><User size={18} /></span>
            <input
              {...register('fullName')}
              type="text"
              placeholder="Your full name"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.fullName && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.fullName.message}</p>}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Mail size={18} /></span>
            <input
              {...register('email')}
              type="email"
              placeholder="you@email.com"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {errors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Lock size={18} /></span>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Lock size={18} /></span>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              {...register('terms')}
              className="accent-green-500 w-4 h-4"
            />
            <label htmlFor="terms" className="text-xs text-gray-700 dark:text-gray-300">
              I accept the <a href="#" className="text-green-500 dark:text-green-400 underline">Terms & Conditions</a>
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.terms.message}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition disabled:opacity-60 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            Register
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="mx-3 text-gray-400 dark:text-gray-500 text-sm">or sign up with</span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-base transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.53 7.82 2.81l5.8-5.8C34.6 3.54 29.74 1.5 24 1.5 14.98 1.5 6.98 7.36 3.34 15.44l6.77 5.25C12.1 14.1 17.6 9.5 24 9.5z"/><path fill="#34A853" d="M46.15 24.5c0-1.64-.15-3.22-.42-4.74H24v9.24h12.44c-.54 2.9-2.18 5.36-4.66 7.04l7.18 5.59C43.98 37.1 46.15 31.3 46.15 24.5z"/><path fill="#FBBC05" d="M10.11 28.69A14.5 14.5 0 0 1 9.5 24c0-1.63.28-3.21.61-4.69l-6.78-5.25A23.97 23.97 0 0 0 0 24c0 3.77.9 7.34 2.5 10.5l7.61-5.81z"/><path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.89-5.84l-7.18-5.59c-2 1.41-4.7 2.43-8.71 2.43-6.4 0-11.9-4.6-13.89-10.69l-7.61 5.81C6.98 40.64 14.98 46.5 24 46.5z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign up with Google
          </button>
        </div>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 dark:text-green-300 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}