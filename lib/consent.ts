"use client";
import { useSyncExternalStore } from "react";

const key = "orel-privacy-v1";
const event = "orel-privacy-change";
let memory: string | null = null;
type Consent = { version: 1; externalMedia: boolean; expires: number };
function read(): string | null {
  let raw = memory;
  try { raw = localStorage.getItem(key); } catch {}
  if (!raw) return null;
  try {
    const item = JSON.parse(raw) as Consent;
    return item.version === 1 && typeof item.externalMedia === "boolean" && item.expires > Date.now() ? raw : null;
  } catch { return null; }
}
function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(event, callback); window.removeEventListener("storage", callback); };
}
export function saveConsent(externalMedia: boolean) {
  memory = JSON.stringify({ version: 1, externalMedia, expires: Date.now() + 180 * 24 * 60 * 60 * 1000 });
  try { localStorage.setItem(key, memory); } catch {}
  window.dispatchEvent(new Event(event));
}
export function useConsent() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return { chosen: raw !== null, externalMedia: raw ? (JSON.parse(raw) as Consent).externalMedia : false };
}
