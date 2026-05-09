"use client";

import { useState, useEffect } from "react";
import { Session, Room } from "@/lib/types";
import SessionCard from "../sessions/SessionCard";

interface LiveSessionsListProps {
  sessions: Session[];
  rooms: Room[];
}

export default function LiveSessionsList({ sessions, rooms }: LiveSessionsListProps) {
  const [liveSessions, setLiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    const checkLiveSessions = () => {
      const now = new Date();
      const live = sessions.filter(
        (session) => now >= session.startTime && now <= session.endTime
      );
      setLiveSessions(live);
    };

    checkLiveSessions();
    const interval = setInterval(checkLiveSessions, 60000);

    return () => clearInterval(interval);
  }, [sessions]);

  if (liveSessions.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">Aucune session en cours pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {liveSessions.map((session) => {
        const room = rooms.find((r) => r.id === session.roomId);
        return <SessionCard key={session.id} session={session} room={room} />;
      })}
    </div>
  );
}