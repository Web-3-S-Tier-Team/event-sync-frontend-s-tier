'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, User, Lock, KeyRound } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, username: userName, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', userName);
      localStorage.setItem('role', role);
      
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-md w-full mx-4">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Welcome Back</h1>
            <p className="text-[var(--text-light)] text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[var(--text-light)] mb-1 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:border-[var(--primary)] transition"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-light)] mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:border-[var(--primary)] transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5"
            >
              <KeyRound className="h-4 w-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-[var(--surface-alt)]">
            <p className="text-sm text-center text-[var(--text-light)]">
              <span className="font-semibold">Demo credentials:</span><br />
              Username: <span className="font-mono text-[var(--primary)]">admin</span><br />
              Password: <span className="font-mono text-[var(--primary)]">admin123</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-light)]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}