'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, Star, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${params.id}`);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const isLive = (session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  const isUpcoming = (session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    return now < start;
  };

  const toggleFavorite = (sessionId, e) => {
    e.preventDefault();
    let newFavorites;
    if (favorites.includes(sessionId)) {
      newFavorites = favorites.filter(id => id !== sessionId);
      toast.success('Removed from favorites');
    } else {
      newFavorites = [...favorites, sessionId];
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Events</span>
      </Link>

      <div className="card mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-6">{event.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>
              {format(new Date(event.startDate), 'MMMM dd, yyyy')} -{' '}
              {format(new Date(event.endDate), 'MMMM dd, yyyy')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>{event.sessions?.length || 0} Sessions</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sessions</h2>

      <div className="space-y-4">
        {event.sessions?.map((session) => {
          const live = isLive(session);
          const upcoming = isUpcoming(session);

          return (
            <div key={session.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {session.title}
                    </h3>
                    {live && <span className="badge-live">LIVE NOW</span>}
                    {upcoming && <span className="badge-upcoming">UPCOMING</span>}
                    {!live && !upcoming && <span className="badge-ended">ENDED</span>}
                  </div>

                  <p className="text-gray-600 mb-3">{session.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(session.startTime), 'h:mm a')} -{' '}
                        {format(new Date(session.endTime), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{session.room?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {session.capacity}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {session.speakers?.map((speaker) => (
                      <Link
                        key={speaker.id}
                        href={`/speakers/${speaker.id}`}
                        className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 text-sm hover:bg-blue-100 transition"
                      >
                        {speaker.profilePhoto ? (
                          <img
                            src={speaker.profilePhoto}
                            alt={speaker.fullName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span>{speaker.fullName}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => toggleFavorite(session.id, e)}
                  className="ml-4 p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Star
                    className={`h-6 w-6 ${
                      favorites.includes(session.id)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  />
                </button>
              </div>

              {live && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/sessions/${session.id}`}
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <span>Join Live Session</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {event.sessions?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sessions scheduled yet.</p>
        </div>
      )}
    </div>
  );
}