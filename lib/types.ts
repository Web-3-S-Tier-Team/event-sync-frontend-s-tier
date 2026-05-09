export interface Speaker {
  id: string;
  name: string;
  photo: string;
  bio: string;
  externalLinks: {
    twitter?: string;
    linkedin?: string;
  };
  sessions: string[];
}

export interface Room {
  id: string;
  name: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  roomId: string;
  capacity: number;
  speakers: Speaker[];
  eventId: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  sessions: Session[];
}

// Données mock
export const mockRooms: Room[] = [
  { id: "1", name: "Grand Amphithéâtre" },
  { id: "2", name: "Salle B" },
  { id: "3", name: "Tech Lab" },
  { id: "4", name: "Workshop Room" },
];

export const mockSpeakers: Speaker[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Expert en IA avec 15 ans d'expérience",
    externalLinks: { twitter: "@sarahj" },
    sessions: ["1", "3"],
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Chercheur en cybersécurité",
    externalLinks: { twitter: "@mchen" },
    sessions: ["2"],
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Product Manager spécialiste UX",
    externalLinks: {},
    sessions: ["2", "4"],
  },
];

export const mockSessions: Session[] = [
  {
    id: "1",
    title: "L'avenir de l'IA",
    description: "Découvrez les dernières avancées en intelligence artificielle",
    startTime: new Date(Date.now() - 30 * 60000),
    endTime: new Date(Date.now() + 60 * 60000),
    roomId: "1",
    capacity: 200,
    speakers: [mockSpeakers[0]],
    eventId: "1",
  },
  {
    id: "2",
    title: "Cybersécurité 2024",
    description: "Les menaces actuelles et solutions innovantes",
    startTime: new Date(Date.now() + 60 * 60000),
    endTime: new Date(Date.now() + 120 * 60000),
    roomId: "2",
    capacity: 150,
    speakers: [mockSpeakers[1], mockSpeakers[2]],
    eventId: "1",
  },
  {
    id: "3",
    title: "Tech & Environnement",
    description: "Solutions technologiques pour un avenir durable",
    startTime: new Date(Date.now() - 15 * 60000),
    endTime: new Date(Date.now() + 45 * 60000),
    roomId: "3",
    capacity: 100,
    speakers: [mockSpeakers[0]],
    eventId: "1",
  },
  {
    id: "4",
    title: "UX Design Moderne",
    description: "Les tendances actuelles en design d'expérience",
    startTime: new Date(Date.now() + 120 * 60000),
    endTime: new Date(Date.now() + 180 * 60000),
    roomId: "4",
    capacity: 80,
    speakers: [mockSpeakers[2]],
    eventId: "1",
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "TechConf 2024",
    description: "La plus grande conférence tech de l'année",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-16"),
    location: "Centre de Conférences International",
    sessions: mockSessions,
  },
  {
    id: "2",
    title: "DevOps Days",
    description: "Le rendez-vous des professionnels DevOps",
    startDate: new Date("2024-04-10"),
    endDate: new Date("2024-04-11"),
    location: "Palais des Congrès",
    sessions: [],
  },
];