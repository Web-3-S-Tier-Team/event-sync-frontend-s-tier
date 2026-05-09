"use client";

import { useParams } from "next/navigation";
import { mockEvents, mockRooms } from "@/lib/types";
import LiveSessionsList from "@/components/events/LiveSessionsList";
import SessionCard from "@/components/sessions/SessionCard";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventPage() {
  const params = useParams();
  const event = mockEvents.find((e) => e.id === params.id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Événement non trouvé</h1>
          <p className="text-gray-600 mt-2">L'événement que vous recherchez n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner de l'événement */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-xl mb-6">{event.description}</p>

          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{event.sessions.length} sessions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Section Sessions en Cours (Live) */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-500 rounded-full h-3 w-3 animate-pulse"></div>
            <h2 className="text-2xl font-bold text-gray-900">Sessions en cours</h2>
          </div>
          <LiveSessionsList sessions={event.sessions} rooms={mockRooms} />
        </div>

        {/* Section Toutes les Sessions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Toutes les sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.sessions.map((session) => {
              const room = mockRooms.find((r) => r.id === session.roomId);
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  room={room}
                  showLiveBadge={true}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}