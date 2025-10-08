'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth0 } from '../../lib/auth0';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await auth0.loginWithCredentials(email, password);
      router.push('/preferences');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    auth0.loginWithSocial(provider);
  };

  return (
    <div className="min-h-screen bg-[#7BAFD4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Welcome Back</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 text-red-100 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-white/70 hover:text-white">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#7BAFD4] py-3 rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#7BAFD4] text-white/80">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google-oauth2')}
              className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2.5 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2.5 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 1.1 0 1.1h3.2c.9 0 1.4.1 1.4 1.1 0 1.1-.1 2.5-.1 2.8.3.3 1 .9 1 1.8 0 1.3-.4 2.3-1.4 3.1.9.3 1.9.1 2.6-.7.7-.9 1.1-2 1.1-3.2 0-1.1-.4-2.1-1-2.8.4-.4.7-1 .7-1.7 0-1.2-.6-1.8-1.1-2.2.6-.2 1.3-.2 2 0 .6.4 1.1 1 1.1 2.2 0 .7-.2 1.3-.6 1.7.6.7 1 1.7 1 2.8 0 2.6-1.6 3-3.1 3.2.2.2.4.6.4 1.1v2.6c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-white/80">
            Don't have an account?{' '}
            <a href="/signup" className="text-white font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
