import { Session, Room } from "@/lib/types";
import LiveBadge from "../events/LiveBadge";
import { Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

interface SessionCardProps {
  session: Session;
  room?: Room;
  showLiveBadge?: boolean;
}

export default function SessionCard({ session, room, showLiveBadge = true }: SessionCardProps) {
  return (
    <Link href={`/events/${session.eventId}/session/${session.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{session.title}</h3>
          {showLiveBadge && <LiveBadge startTime={session.startTime} endTime={session.endTime} />}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{session.description}</p>

        <div className="space-y-1 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3" />
            <span>
              {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
              {session.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {room && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>{room.name}</span>
            </div>
          )}

          {session.speakers.length > 0 && (
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3" />
              <span>{session.speakers.map(s => s.name).join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}