import type { BracketSize, NameEntry } from "../types";

interface SharePayload {
  n: string[]; // names
  s: number[]; // indices of starred names
  z: BracketSize; // target size
}

export interface ShortlistState {
  names: NameEntry[];
  size: BracketSize;
}

const PARAM = "shortlist";

function toBase64(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(b64: string): string {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

let uid = 0;
const newId = () => `s${Date.now().toString(36)}-${uid++}`;

export function encodeShortlist(state: ShortlistState): string {
  const payload: SharePayload = {
    n: state.names.map((x) => x.name),
    s: state.names.flatMap((x, i) => (x.starred ? [i] : [])),
    z: state.size,
  };
  return toBase64(JSON.stringify(payload));
}

export function buildShareUrl(state: ShortlistState): string {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, encodeShortlist(state));
  return url.toString();
}

export function readShortlistFromUrl(): ShortlistState | null {
  try {
    const raw = new URLSearchParams(window.location.search).get(PARAM);
    if (!raw) return null;
    const payload = JSON.parse(fromBase64(raw)) as SharePayload;
    const starred = new Set(payload.s);
    return {
      names: payload.n.map((name, i) => ({ id: newId(), name, starred: starred.has(i) })),
      size: payload.z,
    };
  } catch {
    return null;
  }
}

/** Remove the share param from the address bar without reloading. */
export function clearShareParam(): void {
  const url = new URL(window.location.href);
  if (url.searchParams.has(PARAM)) {
    url.searchParams.delete(PARAM);
    window.history.replaceState({}, "", url.toString());
  }
}
