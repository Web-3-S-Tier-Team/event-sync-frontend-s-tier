'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Users, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(() => { toast.error('Error loading events'); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '3rem', height: '3rem',
            border: '2px solid var(--primary)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-blob" style={{ width: '500px', height: '500px', background: 'color-mix(in srgb, var(--primary) 8%, transparent)', top: '0', left: '-100px' }} />
        <div className="hero-bg-blob" style={{ width: '400px', height: '400px', background: 'color-mix(in srgb, var(--primary) 5%, transparent)', bottom: '0', right: '-80px' }} />

        <div className="container-custom">
          <div className="hero-badge animate-scale">
            <Zap size={16} color="var(--primary)" />
            <span>Welcome to EventSync</span>
          </div>

          <h1 className="hero-title animate-up">
            Discover <span>inspiring</span>
            <br />events
          </h1>

          <p className="hero-subtitle animate-up" style={{ animationDelay: '0.1s' }}>
            Join thousands of professionals discovering inspiring events,
            connecting with experts, and growing together.
          </p>

          <div className="hero-buttons animate-up" style={{ animationDelay: '0.2s' }}>
            <Link href="#events" className="btn-primary">
              Explore events <ChevronRight size={16} />
            </Link>
            <Link href="/speakers" className="btn-secondary">
              Meet our speakers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm">
        <div className="container-custom">
          <div className="stats-grid">
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="stat-icon"><Calendar size={24} /></div>
              <div className="stat-number">{events.length}</div>
              <div className="stat-label">Live Events</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Speakers</div>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="stat-icon"><TrendingUp size={24} /></div>
              <div className="stat-number">100+</div>
              <div className="stat-label">Hours of Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="section">
        <div className="container-custom">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Upcoming Events</h2>
            <div className="divider" />
            <p style={{ color: 'var(--text-light)' }}>Discover the most anticipated conferences and workshops</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((event, idx) => (
              <Link key={event.id} href={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                <div className="card animate-up" style={{ animationDelay: `${idx * 0.05}s`, cursor: 'pointer' }}>
                  <div className="event-row">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>
                          {event.title}
                        </h3>
                        {event.sessions?.some(s => {
                          const now = new Date();
                          return now >= new Date(s.startTime) && now <= new Date(s.endTime);
                        }) && <span className="badge-live">LIVE</span>}
                      </div>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                        {event.description}
                      </p>
                      <div className="event-meta">
                        <span><Calendar size={14} />{format(new Date(event.startDate), 'MMMM dd, yyyy')}</span>
                        <span><MapPin size={14} />{event.location}</span>
                        <span><Clock size={14} />{event.sessions?.length || 0} sessions</span>
                      </div>
                    </div>
                    <div className="event-arrow">
                      <span>Details</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

{/* CTA */}
<section className="section">
  <div className="container-custom">
    <div className="card" style={{
      textAlign: 'center',
      padding: '2.5rem 2rem',
      background: 'color-mix(in srgb, var(--primary) 5%, transparent)',
      borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
        Ready to get started?
      </h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Join our community and never miss an opportunity
      </p>
      <Link href="/register" className="btn-primary">
        Get started <ArrowRight size={16} />
      </Link>
    </div>
  </div>
</section>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}