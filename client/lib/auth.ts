"use client";

import { useEffect, useState } from "react";

export interface AuthUser {
  name: string;
  email: string;
  role?: string;
  badge?: string;
}

// Friendly names for the built-in demo accounts (gmail-login quick sign-in).
const DEMO_NAMES: Record<string, string> = {
  "officer.rajesh.lmo@gmail.com": "Rajesh Kumar — LMO",
  "compliance.msme.brands@gmail.com": "Priya Packaging",
  "citizen.consumer.audit@gmail.com": "Amit Sharma — Citizen",
};

const AUTH_KEYS = [
  "google_user_email",
  "user_authenticated",
  "user_role",
  "user_badge",
  "user_state",
  "user_gstin",
];

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const googleEmail = localStorage.getItem("google_user_email") || "";
  const authenticated = localStorage.getItem("user_authenticated");
  if (!googleEmail && authenticated !== "true") return null;

  const email = googleEmail || "guest.user@gmail.com";
  const role = localStorage.getItem("user_role") || undefined;
  const badge = localStorage.getItem("user_badge") || undefined;
  const fallbackName = googleEmail
    ? titleCase(googleEmail.split("@")[0].replace(/[._-]+/g, " "))
    : role
    ? titleCase(`${role} Officer` || role)
    : "Citizen User";

  return {
    name: DEMO_NAMES[email] || fallbackName,
    email,
    role,
    badge,
  };
}

export const AUTH_CHANGE_EVENT = "packparakh-auth-change";

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
    window.dispatchEvent(new Event("storage"));
  }
}

export function signOutUser() {
  if (typeof window === "undefined") return;
  AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
  notifyAuthChange();
}

/**
 * Reactive auth state: re-syncs instantly whenever auth state changes (e.g. after
 * logging in, signing out, storage changes, or window focus).
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getAuthUser());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return user;
}