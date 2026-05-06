export interface Speaker {
  id: number;
  name: string;
  photo?: string;
  bio?: string;
  socialLinks?: { label: string; url: string }[];
}

export interface Room {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  content: string;
  authorName?: string;
  upvotes: number;
  sessionId: number;
  createdAt: string;
}

export interface Session {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  room: Room;
  capacity?: number;
  speakers: Speaker[];
  questions?: Question[];
  eventId: number;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  sessions: Session[];
}