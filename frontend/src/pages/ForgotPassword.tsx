import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
});
type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      if (!response.ok) {
        setError('Something went wrong. Please try again.');
        toast.error('Something went wrong. Please try again.');
      } else {
        setSuccess(true);
        toast.success('If the email is registered, a reset link will be sent.');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 px-2 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Forgot Password</h2>
        {success ? (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 px-4 py-3 rounded relative text-sm text-center" role="alert">
            If the email is registered, a reset link will be sent.<br />
            <a href="/login" className="text-green-600 dark:text-green-400 underline block mt-2">Return to Login</a>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded relative text-sm" role="alert">
                <span>{error}</span>
              </div>
            )}
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 mt-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition disabled:opacity-60 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 