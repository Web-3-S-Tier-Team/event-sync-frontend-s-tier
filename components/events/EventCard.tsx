import { Event } from "@/lib/types";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-blue-600 font-medium">
              {event.sessions.length} sessions
            </span>
            <span className="text-blue-600">Voir détails →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}