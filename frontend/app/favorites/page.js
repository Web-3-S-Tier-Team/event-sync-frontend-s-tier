'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Clock, MapPin, User, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const [favoriteSessions, setFavoriteSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const favIds = JSON.parse(stored);
      setFavorites(favIds);
      fetchFavoriteSessions(favIds);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavoriteSessions = async (favIds) => {
    try {
      const promises = favIds.map(id => api.get(`/sessions/${id}`));
      const responses = await Promise.all(promises);
      setFavoriteSessions(responses.map(r => r.data));
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (sessionId) => {
    const newFavorites = favorites.filter(id => id !== sessionId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavoriteSessions(favoriteSessions.filter(s => s.id !== sessionId));
    toast.success('Removed from favorites');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Your personalized session itinerary</p>
      </div>

      {favoriteSessions.length > 0 ? (
        <div className="space-y-4">
          {favoriteSessions.map((session) => (
            <div key={session.id} className="card">
              <div className="flex justify-between items-start">
                <Link href={`/sessions/${session.id}`} className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition mb-2">
                    {session.title}
                  </h2>
                  <p className="text-gray-600 mb-3 line-clamp-2">{session.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(session.startTime), 'MMM dd, h:mm a')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{session.room?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{session.speakers?.map(s => s.fullName).join(', ')}</span>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => removeFavorite(session.id)}
                  className="ml-4 p-2 rounded-full hover:bg-red-50 transition group"
                >
                  <Trash2 className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-4">Start adding sessions to your favorites</p>
          <Link href="/" className="btn-primary inline-block">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
}