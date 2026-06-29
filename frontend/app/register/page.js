'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User, Mail, Lock, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { token, username: userName, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', userName);
      localStorage.setItem('role', role);
      toast.success('Registration successful');
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
            background: 'color-mix(in srgb, #10b981 15%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem'
          }}>
            <UserPlus size={20} color="#10b981" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Join EventSync today</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {[
            { label: 'Username', icon: User, type: 'text', value: username, onChange: setUsername, placeholder: 'Choose a username' },
            { label: 'Email', icon: Mail, type: 'email', value: email, onChange: setEmail, placeholder: 'your@email.com' },
            { label: 'Password', icon: Lock, type: 'password', value: password, onChange: setPassword, placeholder: 'Min 6 characters' },
            { label: 'Confirm Password', icon: Lock, type: 'password', value: confirmPassword, onChange: setConfirmPassword, placeholder: 'Confirm your password' },
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
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', opacity: loading ? 0.7 : 1, fontSize: '0.875rem', padding: '0.65rem 1rem' }}
          >
            <CheckCircle size={15} />
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}