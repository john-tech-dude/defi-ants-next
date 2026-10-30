'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const CORRECT_PASSWORD = '5665';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if already authenticated in localStorage
    const storedAuth = localStorage.getItem('site_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('site_authenticated', 'true');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" suppressHydrationWarning>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Protected Site</h1>
            <p className="text-gray-400 text-center">Enter the password to access this site</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div suppressHydrationWarning>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">Incorrect password. Please try again.</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-primary-500/25"
            >
              Enter Site
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
