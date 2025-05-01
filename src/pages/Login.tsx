import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CupSoda, User, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-black px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CupSoda className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            KasirWarung
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Solusi Kasir Praktis untuk Warung
          </p>
        </div>

        <div className="bg-white dark:bg-black p-8 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-error-50 dark:bg-error-900/50 border border-error-200 dark:border-error-800 rounded-lg text-error-600 dark:text-error-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10 w-full dark:bg-slate-700 dark:border-neutral-600 dark:text-white"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 w-full dark:bg-slate-700 dark:border-neutral-600 dark:text-white"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            <p>Demo credentials:</p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;