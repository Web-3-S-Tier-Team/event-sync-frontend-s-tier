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
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-[var(--primary)] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--primary)]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6 animate-scale">
            <Zap className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--text-light)]">Welcome to EventSync</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-up">
            Discover{' '}
            <span className="text-[var(--primary)]">inspiring</span>
            <br />
            events
          </h1>

          <p className="text-lg text-[var(--text-light)] max-w-2xl mx-auto mb-10 animate-up" style={{ animationDelay: '0.1s' }}>
            Join thousands of professionals discovering inspiring events,
            connecting with experts, and growing together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-up" style={{ animationDelay: '0.2s' }}>
            <Link href="#events" className="btn-primary">
              Explore events
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/speakers" className="btn-secondary">
              Meet our speakers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-sm">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center hover:scale-105 transition">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--primary)]">{events.length}</div>
              <div className="text-sm text-[var(--text-light)]">Live Events</div>
            </div>
            <div className="card text-center hover:scale-105 transition">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--primary)]">50+</div>
              <div className="text-sm text-[var(--text-light)]">Expert Speakers</div>
            </div>
            <div className="card text-center hover:scale-105 transition">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div className="text-3xl font-bold text-[var(--primary)]">100+</div>
              <div className="text-sm text-[var(--text-light)]">Hours of Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="section">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Upcoming Events</h2>
            <div className="divider"></div>
            <p className="text-[var(--text-light)]">Discover the most anticipated conferences and workshops</p>
          </div>

          <div className="space-y-4">
            {events.map((event, idx) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="card group cursor-pointer animate-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold group-hover:text-[var(--primary)] transition">
                          {event.title}
                        </h3>
                        {event.sessions?.some(s => {
                          const now = new Date();
                          const start = new Date(s.startTime);
                          const end = new Date(s.endTime);
                          return now >= start && now <= end;
                        }) && <span className="badge-live">LIVE</span>}
                      </div>
                      <p className="text-[var(--text-light)] text-sm mb-3 line-clamp-1">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5"><Calendar size={14} />{format(new Date(event.startDate), 'MMMM dd, yyyy')}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} />{event.location}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} />{event.sessions?.length || 0} sessions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition">
                      <span className="text-sm font-medium">Details</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-custom">
          <div className="card text-center p-12 bg-[var(--primary)]/5 border-[var(--primary)]/20">
            <h2 className="text-3xl font-bold mb-3 text-[var(--primary)]">Ready to get started?</h2>
            <p className="text-[var(--text-light)] mb-6">Join our community and never miss an opportunity</p>
            <Link href="/register" className="btn-primary">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}