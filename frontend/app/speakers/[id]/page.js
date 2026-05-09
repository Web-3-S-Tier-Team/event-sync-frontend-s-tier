'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Calendar, Clock, Award, Globe, Twitter, Linkedin, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function SpeakerDetailPage() {
  const params = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeaker();
  }, [params.id]);

  const fetchSpeaker = async () => {
    try {
      const response = await api.get(`/speakers/${params.id}`);
      setSpeaker(response.data);
    } catch (error) {
      toast.error('Failed to load speaker details');
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

  if (!speaker) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Speaker not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/speakers" className="inline-flex items-center space-x-2 text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Speakers</span>
      </Link>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {speaker.profilePhoto ? (
            <img
              src={speaker.profilePhoto}
              alt={speaker.fullName}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <User className="h-16 w-16 text-blue-500" />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <h1 className="text-3xl font-bold text-gray-900">{speaker.fullName}</h1>
            </div>
            <p className="text-gray-600 leading-relaxed">{speaker.biography}</p>
            {speaker.externalLinks && (
              <div className="flex justify-center md:justify-start space-x-3 mt-4">
                <Globe className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600 transition" />
                <Twitter className="h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-400 transition" />
                <Linkedin className="h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-600 transition" />
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sessions by {speaker.fullName}</h2>

      <div className="space-y-4">
        {speaker.sessions?.map((session) => (
          <Link key={session.id} href={`/sessions/${session.id}`}>
            <div className="card hover:shadow-lg transition-all cursor-pointer group">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition mb-2">
                {session.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{session.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{session.event?.title}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(session.startTime), 'MMM dd, h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {speaker.sessions?.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No sessions scheduled for this speaker.</p>
          </div>
        )}
      </div>
    </div>
  );
}