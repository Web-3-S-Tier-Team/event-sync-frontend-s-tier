'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Calendar, Award, User } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Featured Speakers
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Meet our expert speakers and industry leaders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker) => (
          <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
            <div className="card hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-center space-x-4 mb-4">
                {speaker.profilePhoto ? (
                  <img
                    src={speaker.profilePhoto}
                    alt={speaker.fullName}
                    className="w-20 h-20 rounded-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-blue-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    {speaker.fullName}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Award className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-500">Featured Speaker</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {speaker.biography}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{speaker.sessions?.length || 0} Sessions</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {speakers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No speakers available at the moment.</p>
        </div>
      )}
    </div>
  );
}