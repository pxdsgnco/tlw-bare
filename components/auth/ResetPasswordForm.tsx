'use client';

import { useState } from 'react';
import { useAuthModal } from '@/hooks/useAuthModal';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { switchView } = useAuthModal();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Check your email
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>We&apos;ve sent a password reset link to {email}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => switchView('login')}
                  className="text-sm font-medium text-green-800 hover:text-green-700"
                >
                  Back to login →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#fb7102] focus:border-[#fb7102] focus:z-10 sm:text-sm"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#fb7102] hover:bg-[#e5650a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb7102] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => switchView('login')}
          className="text-sm text-[#fb7102] hover:text-[#e5650a]"
        >
          Back to login
        </button>
      </div>
    </form>
  );
}