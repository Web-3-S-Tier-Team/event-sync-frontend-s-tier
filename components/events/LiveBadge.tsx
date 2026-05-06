"use client";

import { useState, useEffect } from "react";
import { Circle } from "lucide-react";

interface LiveBadgeProps {
  startTime: Date;
  endTime: Date;
}

export default function LiveBadge({ startTime, endTime }: LiveBadgeProps) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkIfLive = () => {
      const now = new Date();
      setIsLive(now >= startTime && now <= endTime);
    };

    checkIfLive();
    const interval = setInterval(checkIfLive, 60000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!isLive) return null;

  return (
    <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
      <Circle className="h-2 w-2 fill-current" />
      <span>LIVE</span>
    </div>
  );
}