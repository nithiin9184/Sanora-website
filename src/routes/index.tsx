import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsQueryOptions, reviewPageCount } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SiteFooter } from "@/components/site-footer";
import { DownloadLink } from "@/components/download-link";
import { useEffect, useState } from "react";
import { Check, ShieldCheck, Star, ChevronDown, Sliders, Waves, Mic2, Moon, Bluetooth, X, ArrowUpRight, Headphones, Shuffle, Sparkles, DownloadCloud } from "lucide-react";
import logo from "@/assets/sanora-logo.webp";
import s1 from "@/assets/shot1.webp";
import s2 from "@/assets/shot2.webp";
import s3 from "@/assets/shot3.webp";
import s4 from "@/assets/shot4.webp";
import s5 from "@/assets/shot5.webp";
import s6 from "@/assets/shot6.webp";
import g1 from "@/assets/guide-step1.webp";
import g2 from "@/assets/guide-step2.webp";
import g3 from "@/assets/guide-step3.webp";
import g4 from "@/assets/guide-step4.webp";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { reviewPage?: number } => ({
    reviewPage: Number.isFinite(Number(search['reviewPage'])) ? Math.max(1, Math.floor(Number(search['reviewPage']))) : 1,
  }),
  loaderDeps: ({ search }) => ({ reviewPage: search.reviewPage ?? 1 }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(reviewsQueryOptions(deps.reviewPage)),
  errorComponent: () => <p role="alert" className="p-6 text-center">Couldn't load SANORA Music. Please refresh and try again.</p>,
  notFoundComponent: () => <p className="p-6 text-center">SANORA Music page not found.</p>,
  head: () => ({
    meta: [
      { title: "SANORA Music — Android Music Player & Metadata Manager" },
      { name: "description", content: "Open Android audio player with built-in 10-band equalizer, gapless playback, and public playlist metadata import." },
      { property: "og:title", content: "SANORA Music — Android Audio Player & Equalizer" },
      { property: "og:description", content: "Custom equalizer DSP, background playback, and playlist metadata organizing tool for Android." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const WHATSAPP = "https://wa.me/917672052771?text=Hi%20SANORA%20Support%2C%20I%20need%20help%20with%20the%20Android%20app.";
const shots = [s1, s2, s3, s4, s5, s6];
const nav = [
  ["About", "about"], ["Features", "features"],
  ["Community Reviews", "community-reviews"], ["Guide", "guide"], ["FAQ", "faq"],
];

function Android({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 00-.65-.38l-1.86 3.22a11.4 11.4 0 00-9.86 0L5.2 5.92a.38.38 0 00-.65.38L6.4 9.48A10.8 10.8 0 001 18h22a10.8 10.8 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-6 px-4 py-12 md:py-16">
      <h2 className="text-center text-xl font-bold md:text-3xl">{title}</h2>
      {sub && <p className="mx-auto mt-2 max-w-xl text-center text-xs text-muted-foreground md:text-sm">{sub}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Slider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v - 1 + shots.length) % shots.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pointer-events-none relative mx-auto h-[380px] w-full max-w-4xl select-none overflow-hidden md:h-[520px]">
      {shots.map((src, k) => {
        let d = k - i;
        if (d > 3) d -= 6;
        if (d < -2) d += 6;
        const a = Math.abs(d);
        return (
          <img
            key={k}
            src={src}
            alt={`SANORA screenshot ${k + 1}`}
            width={540}
            height={959}
            loading="eager"
            decoding="async"
            fetchPriority={k === 0 ? "high" : "auto"}
            draggable={false}
            className="absolute left-1/2 top-1/2 w-[170px] rounded-[1.75rem] border border-border md:w-[240px]"
            style={{
              transform: `translate(-50%,-50%) translateX(${d * 62}%) scale(${a === 0 ? 1 : a === 1 ? 0.8 : 0.62})`,
              opacity: a === 0 ? 1 : a === 1 ? 0.55 : a === 2 ? 0.2 : 0,
              zIndex: 10 - a,
              filter: a === 0 ? "none" : "blur(1px) grayscale(40%)",
              transition: "all 900ms cubic-bezier(.65,0,.35,1)",
            }}
          />
        );
      })}
    </div>
  );
}

import logoSpotify from "@/assets/logo-spotify.webp";
import logoAppleMusic from "@/assets/logo-applemusic.webp";
import logoJioSaavn from "@/assets/logo-jiosaavn.webp";
import logoGaana from "@/assets/logo-gaana.webp";
import logoAmazonMusic from "@/assets/logo-amazonmusic.webp";

const brands = [
  ["Spotify", logoSpotify],
  ["Apple Music", logoAppleMusic],
  ["JioSaavn", logoJioSaavn],
  ["Gaana", logoGaana],
  ["Amazon Music", logoAmazonMusic],
] as const;

const APP_VERSION = "6.1.1";

const guide = [
  ["Download APK Package", "Tap Download App to save the Android application package (APK) directly to your device.", g1],
  ["Confirm Browser Download", "Android browsers show a standard confirmation for direct APK files. Tap Download to proceed.", g2],
  ["Standard Android Permission", "If installing an APK for the first time from your browser, enable the standard 'Install unknown apps' permission.", g3],
  ["Complete Installation", "Tap Install to finish setup and open SANORA Music.", g4],
];

const features = [
  [Sliders, "10-Band Audio Equalizer", "Custom DSP equalizer curve from 32Hz to 16kHz for personalized audio tuning."],
  [Waves, "Bass Boost & Sound Shaping", "Configurable low-end boost and custom tone profiles tailored to your earphones."],
  [Headphones, "High-Bitrate Audio Playback", "Dynamic bitrate playback stream with adaptive buffer management."],
  [Shuffle, "Gapless Transitions", "Smooth crossfade and gapless playback between consecutive queue tracks."],
  [Sparkles, "Responsive Player UI", "Dynamic backdrop accents adapting to the current track artwork."],
  [Mic2, "Synchronized Lyrics", "Real-time scrolling lyrics synced to playback timestamps where available."],
  [Moon, "Dark Mode Theme", "Battery-friendly pure black theme optimized for OLED and AMOLED screens."],
  [DownloadCloud, "Local Storage Caching", "Save tracks to your device storage cache for uninterrupted offline listening."],
  [Bluetooth, "Audio Output Management", "Seamless switching across Bluetooth headsets and system output devices."],
] as const;

type Review = { name: string; rating: number; text: string };
function Stars({ n, size = "h-3 w-3" }: { n: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((k) => <Star key={k} className={`${size} ${k <= n ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />)}
    </div>
  );
}

function Reviews() {
  const qc = useQueryClient();
  const { reviewPage: selectedPage } = Route.useSearch();
  const reviewPage = selectedPage ?? 1;
  const navigate = Route.useNavigate();
  const { data: { reviews: list, total } } = useSuspenseQuery(reviewsQueryOptions(reviewPage));
  const pages = reviewPageCount(total);
  const goToPage = (page: number) => navigate({ search: (previous) => ({ ...previous, reviewPage: page }), hash: "community-reviews", resetScroll: false });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState<Review>({ name: "", rating: 5, text: "" });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const row = { name: f.name.trim().slice(0, 40), rating: f.rating, text: f.text.trim().slice(0, 300) };
    if (!row.name || !row.text) return setErr("Please add your name and review.");
    setBusy(true); setErr("");
    const { error } = await supabase.from("reviews").insert(row);
    setBusy(false);
    if (error) return setErr("Couldn't post your review. Please try again.");
    await qc.invalidateQueries({ queryKey: ["reviews"] });
    await goToPage(1);
    setF({ name: "", rating: 5, text: "" });
    setOpen(false);
  };
  return (
    <>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <div key={r.id} className="glass rounded-xl p-4">
            <Stars n={r.rating} />
            <p className="mt-2.5 text-xs leading-relaxed">"{r.text}"</p>
            <p className="mt-2.5 text-xs text-muted-foreground">— {r.name}</p>
          </div>
        ))}
      </div>
      {total === 0 && (
        <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-center">
          <p className="text-sm font-medium">Early Beta Community</p>
          <p className="mt-1 text-xs text-muted-foreground">SANORA v6.1.1 is in open beta. Be the first from the listener community to share your feedback below.</p>
        </div>
      )}
      {pages > 1 && (
        <nav aria-label="Review pages" className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
            <Button key={page} size="icon" variant={page === reviewPage ? "default" : "outline"} aria-label={`Review page ${page}`} aria-current={page === reviewPage ? "page" : undefined} onClick={() => void goToPage(page)}>{page}</Button>
          ))}
        </nav>
      )}
      <div className="mt-6 text-center">
        <button onClick={() => setOpen(true)} className="rounded-full border border-border-strong px-4 py-2 text-xs font-medium transition hover:bg-card">Leave a Review</button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur" onClick={() => setOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="glass w-full max-w-sm rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Leave a Review</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((k) => (
                <button type="button" key={k} onClick={() => setF({ ...f, rating: k })} aria-label={`${k} stars`}>
                  <Star className={`h-6 w-6 ${k <= f.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                </button>
              ))}
            </div>
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" maxLength={40} className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30" />
            <textarea value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} placeholder="Your impressions" maxLength={300} rows={3} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30" />
            {err && <p className="mt-2 text-xs text-status-bad">{err}</p>}
            <button disabled={busy} className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Posting…" : "Submit"}</button>
          </form>
        </div>
      )}
    </>
  );
}

const faqs = [
  ["What is SANORA Music?", "SANORA Music is an independent Android audio player and media organizer that plays public audio streams and lets you organize personal playlists with a custom equalizer."],
  ["How does playlist metadata import work?", "Paste a public playlist URL from supported streaming platforms. SANORA reads the song titles and artist names, creating a matching playlist in your local library. It does not transfer or convert audio files from third-party services."],
  ["Why is SANORA distributed via direct APK?", "SANORA is currently provided as a direct Android APK package for beta testing and independent distribution directly to listeners without store intermediaries."],
  ["Are downloaded songs and settings preserved during updates?", "Yes. Installing an updated APK package over an existing installation retains your local cache, playlists, and equalizer presets."],
];

function Faq() {
  const [o, setO] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-2xl space-y-2">
      {faqs.map(([q, a], k) => (
        <div key={q} className="glass rounded-xl">
          <button onClick={() => setO(o === k ? null : k)} className="flex w-full items-center justify-between gap-3 p-3.5 text-left text-sm font-medium">
            {q}<ChevronDown className={`h-4 w-4 shrink-0 transition ${o === k ? "rotate-180" : ""}`} />
          </button>
          <div className={`grid transition-all duration-300 ${o === k ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <p className="overflow-hidden px-3.5 text-xs text-muted-foreground"><span className="block pb-3.5">{a}</span></p>
          </div>
        </div>
      ))}
      <div className="glass mt-5 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold">Version {APP_VERSION}</span>
          <span className="text-xs text-muted-foreground">Release: October 2026</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Version 6.1.1 update featuring 10-band equalizer DSP, gapless track transitions, adaptive player UI, and offline storage caching.</p>
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="overflow-x-hidden">
      <header id="about" className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 text-center md:pt-14">
        <img src={logo} alt="SANORA logo" className="h-12 w-12 md:h-14 md:w-14" />
        <span className="mt-3 text-sm font-black tracking-[0.35em]">SANORA</span>
        <h1 className="mt-6 text-2xl font-bold leading-[1.15] md:text-5xl">
          Personal Audio Player
          <br />
          Built-in Studio Equalizer
          <br />
          <span className="text-gold">Tailored for Android</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-subtle md:text-base">An independent client-side audio player featuring a 10-band DSP equalizer, offline caching, and public playlist metadata sync.</p>
        <nav className="mt-6 flex flex-wrap justify-center gap-1.5">
          {nav.map(([l, id]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-foreground/20 bg-foreground/[0.06] px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-foreground/40 hover:bg-foreground hover:text-background">{l}</a>
          ))}
        </nav>
        <DownloadLink className="btn-perimeter mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-primary-foreground transition hover:scale-[1.02] hover:opacity-90">
          <Android className="h-3.5 w-3.5" />
          <span className="text-sm font-bold">Download App</span>
          <span className="text-[10px] opacity-60">Version {APP_VERSION}</span>
        </DownloadLink>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-foreground/70" />Direct release package (APK)</p>
        <p className="mt-1.5 max-w-sm text-[11px] text-muted-foreground">Lightweight Android client with local storage caching and ad-free listening.</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-xs font-medium text-subtle transition hover:border-foreground/40 hover:bg-card hover:text-foreground">
          Contact Support <ArrowUpRight className="h-3 w-3" />
        </a>
      </header>

      <div className="mt-4"><Slider /></div>

      <section className="py-10 text-center">
        <h2 className="px-4 text-lg font-bold md:text-2xl">Playlist Metadata Transfer</h2>
        <p className="mx-auto mt-2 max-w-md px-4 text-xs text-muted-foreground">Parse public playlist links to migrate track titles and artist names into your personal library.</p>
        <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="marquee flex w-max items-center gap-12">
            {[...brands, ...brands, ...brands, ...brands].map(([name, src], k) => (
              <img key={k} src={src} alt={`${name} logo`} className="h-6 w-auto opacity-70 md:h-8" loading="eager" decoding="async" />
            ))}
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-md px-4 text-xs text-muted-foreground">Reads public text and metadata from supported platforms. Does not download or transfer copyrighted audio files between services.</p>
      </section>

      <Section id="features" title="Studio Specs">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([I, t, d]) => (
            <div key={t} className="glass rounded-2xl p-5">
              <I className="h-5 w-5 text-subtle" />
              <h3 className="mt-3 text-sm font-semibold">{t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="community-reviews" title="Community Reviews"><Reviews /></Section>

      <Section id="guide" title="Install in 4 Steps" sub="Quick Android installation guide.">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {guide.map(([t, d, shot], k) => (
            <div key={t} className="glass rounded-2xl p-4">
              <img src={shot} alt={t} className="mx-auto h-72 w-auto object-contain" loading="lazy" />
              <p className="mt-3 text-[10px] text-muted-foreground">Step {k + 1}</p>
              <h3 className="text-sm font-semibold">{t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Official distribution built directly for Android devices.</p>
      </Section>

      <Section id="faq" title="FAQ & Release Notes"><Faq /></Section>

      <SiteFooter />
    </main>
  );
}
