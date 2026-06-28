'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Users, LogIn, UserPlus, LogOut, Star, Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Vérifier l'état de connexion au chargement et quand la route change
  useEffect(() => {
    checkAuth();

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    if (token && name) {
      setIsLoggedIn(true);
      setUsername(name);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  const toggleTheme = () => {
    const dark = document.documentElement.classList.contains('dark');
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('favorites');
    setIsLoggedIn(false);
    setUsername('');
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Vérifier le thème au chargement
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--primary)]">EventSync</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition ${
              pathname === '/' ? 'text-[var(--primary)]' : 'text-[var(--text-light)] hover:text-[var(--primary)]'
            }`}>Events</Link>
            <Link href="/speakers" className={`text-sm font-medium transition ${
              pathname === '/speakers' ? 'text-[var(--primary)]' : 'text-[var(--text-light)] hover:text-[var(--primary)]'
            }`}>Speakers</Link>
            {isLoggedIn && (
              <Link href="/favorites" className="text-sm font-medium text-[var(--text-light)] hover:text-[var(--warning)] transition">Favorites</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--surface-alt)] transition">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-[var(--text-light)]">Hi, <span className="font-medium text-[var(--text)]">{username}</span></span>
                  <button onClick={logout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition">Login</Link>
                  <Link href="/register" className="btn-primary text-sm py-2">Sign up</Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-full hover:bg-[var(--surface-alt)] transition">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] animate-up">
            <div className="flex flex-col gap-3">
              <Link href="/" className="py-2" onClick={() => setMobileOpen(false)}>Events</Link>
              <Link href="/speakers" className="py-2" onClick={() => setMobileOpen(false)}>Speakers</Link>
              {isLoggedIn && <Link href="/favorites" className="py-2" onClick={() => setMobileOpen(false)}>Favorites</Link>}
              {isLoggedIn ? (
                <button onClick={logout} className="py-2 text-left text-red-500 flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" className="flex-1 text-center py-2 border border-[var(--border)] rounded-full" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link href="/register" className="flex-1 text-center btn-primary py-2" onClick={() => setMobileOpen(false)}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}