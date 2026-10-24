// Server-side playlist resolver for public playlists from Spotify, JioSaavn, Apple Music, Gaana, and Amazon Music.
export type ImportPlatform = "spotify" | "apple" | "jiosaavn" | "gaana" | "amazon";

export interface ImportedTrack {
  title: string;
  artist: string;
  album: string;
}

export interface ImportedPlaylist {
  platform: ImportPlatform;
  id: string;
  name: string;
  cover: string | null;
  tracks: ImportedTrack[];
}

export interface DetectedLink {
  platform: ImportPlatform;
  id: string;
  url: string;
}

const UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36";
const TIMEOUT_MS = 15_000;

export function spotifyPlaylistId(input: string): string | null {
  const m = input.trim().match(/^https:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?playlist\/([A-Za-z0-9]{10,40})/);
  return m ? m[1]! : null;
}

export function detectPlaylistLink(input: string): DetectedLink | null {
  if (!input || typeof input !== "string") return null;
  const raw = input.trim().match(/https?:\/\/\S+/)?.[0];
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.replace(/^www\./, "").toLowerCase();
  const path = u.pathname.replace(/\/+$/, "");
  const url = `https://${u.hostname}${u.pathname}${u.search}`;

  if (host === "open.spotify.com") {
    const id = spotifyPlaylistId(`https://open.spotify.com${path}`);
    return id ? { platform: "spotify", id, url } : null;
  }
  if (host === "music.apple.com" || host === "embed.music.apple.com") {
    const m = path.match(/\/playlist\/(?:[^/]+\/)?(pl\.[A-Za-z0-9-]+)/);
    return m ? { platform: "apple", id: m[1]!, url } : null;
  }
  if (host === "jiosaavn.com" || host === "saavn.com") {
    const m = path.match(/\/(?:featured|s\/playlist)\/(?:[^/]+\/)*([A-Za-z0-9_,-]{4,})$/);
    return m ? { platform: "jiosaavn", id: m[1]!, url } : null;
  }
  if (host === "gaana.com") {
    const m = path.match(/^\/playlist\/([A-Za-z0-9_-]+)/);
    return m ? { platform: "gaana", id: m[1]!, url } : null;
  }
  if (/^music\.amazon\.[a-z.]+$/.test(host)) {
    const m = path.match(/\/(?:user-)?playlists\/([A-Za-z0-9]+)/);
    return m ? { platform: "amazon", id: m[1]!, url } : null;
  }
  return null;
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\u00a0/g, " ")
    .trim();

function metaContent(html: string, prop: string): string | null {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, "i");
  const m = html.match(re) ?? html.match(re2);
  return m ? decode(m[1]!) : null;
}

type Json = Record<string, unknown>;
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : v == null ? [] : [v]);
const str = (v: unknown): string => (typeof v === "string" ? decode(v) : "");
function artistName(v: unknown): string {
  return asArr(v).map((a) => (typeof a === "string" ? a : str((a as Json)?.["name"]))).filter(Boolean).join(", ");
}

export function parseJsonLdPlaylist(html: string, platform: ImportPlatform, id: string): ImportedPlaylist | null {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    let data: unknown;
    try {
      data = JSON.parse(b[1]!.trim());
    } catch {
      continue;
    }
    const nodes = asArr(data).flatMap((n) => [n, ...asArr((n as Json)?.["@graph"])]) as Json[];
    for (const n of nodes) {
      const type = asArr(n?.["@type"]).map(String);
      if (!type.includes("MusicPlaylist") && !type.includes("MusicAlbum")) continue;
      const items = asArr(n["track"] ?? (n["tracks"] as unknown)).flatMap((t) => {
        const tj = t as Json;
        return tj?.["@type"] === "ItemList" ? asArr(tj["itemListElement"]) : [t];
      });
      const tracks = items
        .map((t) => {
          const tj = ((t as Json)?.["item"] as Json) ?? (t as Json);
          return {
            title: str(tj?.["name"]),
            artist: artistName(tj?.["byArtist"]),
            album: str((tj?.["inAlbum"] as Json)?.["name"]),
          };
        })
        .filter((t) => t.title);
      if (!tracks.length) continue;
      const img = asArr(n["image"])[0];
      return {
        platform,
        id,
        name: str(n["name"]) || `${platform} Playlist`,
        cover: typeof img === "string" ? img : str((img as Json)?.["url"]) || metaContent(html, "og:image"),
        tracks,
      };
    }
  }
  return null;
}

export function parseSpotifyEmbed(html: string, id: string): ImportedPlaylist | null {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    const e = JSON.parse(m[1]!)?.props?.pageProps?.state?.data?.entity;
    if (!e || !Array.isArray(e.trackList)) return null;
    return {
      platform: "spotify",
      id,
      name: String(e.name ?? e.title ?? "Spotify Playlist"),
      cover: e.coverArt?.sources?.[0]?.url ?? null,
      tracks: e.trackList
        .filter((t: { title?: string }) => t?.title)
        .map((t: { title: string; subtitle?: string; album?: string }) => ({
          title: t.title,
          artist: String(t.subtitle ?? "").replace(/\u00a0/g, " "),
          album: t.album ?? "",
        })),
    };
  } catch {
    return null;
  }
}

export function parseJioSaavnPlaylist(json: unknown, id: string): ImportedPlaylist | null {
  const d = json as Json | null;
  const list = asArr(d?.["list"] ?? d?.["songs"]);
  if (!d || !list.length) return null;
  const tracks = list
    .map((s) => {
      const sj = s as Json;
      const more = (sj["more_info"] as Json) ?? {};
      const primary = asArr(((more["artistMap"] as Json)?.["primary_artists"]) ?? []).map((a) => str((a as Json)?.["name"])).filter(Boolean);
      return {
        title: str(sj["title"] ?? sj["song"]),
        artist: primary.join(", ") || str(sj["subtitle"] ?? sj["primary_artists"]).split(" - ")[0]!,
        album: str(more["album"] ?? sj["album"]),
      };
    })
    .filter((t) => t.title);
  if (!tracks.length) return null;
  return {
    platform: "jiosaavn",
    id,
    name: str(d["title"] ?? d["listname"]) || "JioSaavn Playlist",
    cover: str(d["image"]) || null,
    tracks,
  };
}

export const UNREADABLE_LINK_MESSAGE =
  "Unable to read public tracks from this link. Make sure the playlist is set to public or export as text.";

export async function fetchExternalPlaylist(rawUrl: string): Promise<ImportedPlaylist> {
  const link = detectPlaylistLink(rawUrl);
  if (!link) {
    throw new Error("Paste a public playlist link from Spotify, Apple Music, JioSaavn, Gaana or Amazon Music.");
  }

  let parsed: ImportedPlaylist | null = null;
  try {
    if (link.platform === "spotify") {
      const res = await fetch(`https://open.spotify.com/embed/playlist/${link.id}`, {
        headers: { "User-Agent": UA, "Accept-Language": "en-IN,en;q=0.9" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) {
        parsed = parseSpotifyEmbed(await res.text(), link.id);
      }
    } else if (link.platform === "jiosaavn") {
      const api = `https://www.jiosaavn.com/api.php?__call=webapi.get&token=${encodeURIComponent(link.id)}&type=playlist&p=1&n=500&includeMetaTags=0&ctx=web6dot0&api_version=4&_format=json&_marker=0`;
      const res = await fetch(api, {
        headers: { "User-Agent": UA, "Accept-Language": "en-IN,en;q=0.9" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) {
        parsed = parseJioSaavnPlaylist(await res.json(), link.id);
      }
    } else {
      const res = await fetch(link.url, {
        headers: { "User-Agent": UA, "Accept-Language": "en-IN,en;q=0.9" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) {
        parsed = parseJsonLdPlaylist(await res.text(), link.platform, link.id);
      }
    }
  } catch (e) {
    console.warn("External playlist fetch error:", e);
    parsed = null;
  }

  if (!parsed || !parsed.tracks.length) {
    throw new Error(UNREADABLE_LINK_MESSAGE);
  }

  parsed.tracks = parsed.tracks.slice(0, 500);
  return parsed;
}
