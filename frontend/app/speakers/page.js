'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Calendar, Award, User } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSpeakers(); }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await api.get('/speakers');
      setSpeakers(response.data);
    } catch (error) {
      toast.error('Failed to load speakers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{
          width: '2.5rem', height: '2.5rem',
          border: '2px solid var(--primary)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="container-custom">

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Featured Speakers
          </h1>
          <div className="divider" />
          <p style={{ color: 'var(--text-light)', marginTop: '0.75rem' }}>
            Meet our expert speakers and industry leaders
          </p>
        </div>

        {speakers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>No speakers available at the moment.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {speakers.map((speaker) => (
              <Link key={speaker.id} href={`/speakers/${speaker.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {speaker.profilePhoto ? (
                      <img
                        src={speaker.profilePhoto}
                        alt={speaker.fullName}
                        style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '4rem', height: '4rem', borderRadius: '50%',
                        background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <User size={24} color="var(--primary)" />
                      </div>
                    )}
                    <div>
                      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
                        {speaker.fullName}
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Award size={12} color="var(--warning)" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Featured Speaker</span>
                      </div>
                    </div>
                  </div>

                  <p style={{
                    color: 'var(--text-light)', fontSize: '0.875rem',
                    marginBottom: '0.75rem', lineHeight: 1.5,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
                  }}>
                    {speaker.biography}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <Calendar size={14} />
                    <span>{speaker.sessions?.length || 0} Sessions</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}