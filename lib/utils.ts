import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function formatDate(date: Date | string, withTime = false): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
    timeZone: "Europe/Paris",
  }).format(d);
}

/** Décalage de Paris (« +01:00 » ou « +02:00 ») à une date donnée. */
export function parisOffset(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", timeZoneName: "longOffset" }).formatToParts(date);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+01:00";
  const offset = tz.replace("GMT", "");
  return offset || "+00:00";
}

/** « 2027-02-25T23:59 » (heure de Paris, input datetime-local) → Date. */
export function parseParisLocal(value: string): Date | null {
  const v = value.trim();
  if (!v) return null;
  const m = v.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2}))?$/);
  if (!m) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const naive = new Date(`${m[1]}T${m[2] ?? "00"}:${m[3] ?? "00"}:00Z`);
  const d = new Date(`${m[1]}T${m[2] ?? "00"}:${m[3] ?? "00"}:00${parisOffset(naive)}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Date → « 2027-02-25T23:59 » en heure de Paris (pour un input datetime-local). */
export function toParisLocalInput(date: Date | null | undefined, withTime = true): string {
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = `${get("year")}-${get("month")}-${get("day")}`;
  return withTime ? `${day}T${get("hour")}:${get("minute")}` : day;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
