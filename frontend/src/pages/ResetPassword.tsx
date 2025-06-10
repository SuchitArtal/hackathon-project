import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, Lock, Eye } from 'lucide-react';

const resetSchema = z.object({
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});
type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.detail || 'Something went wrong.');
        toast.error(errData.detail || 'Something went wrong.');
      } else {
        setSuccess(true);
        toast.success('Password changed successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 px-2 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-800 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-bounce">Invalid or Expired Link</h2>
          <p className="text-red-600 dark:text-red-400">Reset token is missing, invalid, or expired.</p>
          <a href="/forgot-password" className="text-green-600 dark:text-green-400 underline block mt-2">Request a new reset link</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 px-2 transition-colors">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-green-500" size={48} />
        </div>
      )}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Reset Password</h2>
        {success ? (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 px-4 py-3 rounded relative text-sm text-center animate-pulse" role="alert">
            Password changed successfully! Redirecting to login...<br />
            <a href="/login" className="text-green-600 dark:text-green-400 underline block mt-2">Return to Login</a>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded relative text-sm animate-shake" role="alert">
                <span>{error}</span>
              </div>
            )}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Lock size={18} /></span>
              <input
                {...register('new_password')}
                type="password"
                placeholder="New Password"
                className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                tabIndex={-1}
              >
                <Eye size={18} />
              </button>
              {errors.new_password && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.new_password.message}</p>}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"><Lock size={18} /></span>
              <input
                {...register('confirm_password')}
                type="password"
                placeholder="Confirm Password"
                className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-transparent dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                tabIndex={-1}
              >
                <Eye size={18} />
              </button>
              {errors.confirm_password && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.confirm_password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 mt-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition disabled:opacity-60 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 