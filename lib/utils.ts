import { Session } from "@/types";

export function isSessionLive(session: Session): boolean {
  const now = new Date();
  return now >= new Date(session.startTime) && now <= new Date(session.endTime);
}

export function getSessionStatus(session: Session): "live" | "upcoming" | "ended" {
  const now = new Date();
  if (now < new Date(session.startTime)) return "upcoming";
  if (now > new Date(session.endTime)) return "ended";
  return "live";
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}