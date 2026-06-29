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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem 1rem 2rem',
      background: 'var(--bg)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '360px', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3rem', height: '3rem', borderRadius: '50%',
            background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <LogIn size={20} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            { label: 'Username', icon: User, type: 'text', value: username, onChange: setUsername, placeholder: 'Enter your username' },
            { label: 'Password', icon: Lock, type: 'password', value: password, onChange: setPassword, placeholder: 'Enter your password' },
          ].map(({ label, icon: Icon, type, value, onChange, placeholder }) => (
            <div key={label}>
              <label style={{ fontSize: '0.8rem' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={15} style={{
                  position: 'absolute', left: '0.75rem',
                  top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none'
                }} />
                <input
                  type={type}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  required
                  style={{ paddingLeft: '2.25rem', padding: '0.6rem 0.75rem 0.6rem 2.25rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1, fontSize: '0.875rem', padding: '0.65rem 1rem' }}
          >
            <KeyRound size={15} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          background: 'var(--surface-alt)',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-light)',
          lineHeight: 1.6
        }}>
          <span style={{ fontWeight: 600 }}>Demo credentials:</span><br />
          Username: <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>admin</span><br />
          Password: <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>admin123</span>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}