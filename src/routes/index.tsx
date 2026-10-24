import { useQuery } from "@tanstack/react-query";
import { getLaunchCoupon } from "@/lib/coupons.functions";
import { LAUNCH_COUPON, LAUNCH_COUPON_SLOTS } from "@/lib/pricing";
import { createFileRoute } from "@tanstack/react-router";
import { couponTone } from "@/lib/coupon";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsQueryOptions, reviewPageCount } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SiteFooter } from "@/components/site-footer";
import { DownloadLink } from "@/components/download-link";
import { useEffect, useState } from "react";
import { Check, Copy, ShieldCheck, Star, ChevronDown, Sliders, Waves, Mic2, Moon, Bluetooth, X, ArrowUpRight, Headphones, Shuffle, Sparkles, DownloadCloud } from "lucide-react";
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
      { title: "SANORA Music — Pure Lossless Sound. Download APK" },
      { name: "description", content: "Next-gen audiophile music streamer with studio DSP and universal playlist import. Download the SANORA APK." },
      { property: "og:title", content: "SANORA Music — Pure Lossless Sound" },
      { property: "og:description", content: "Studio DSP, AMOLED black, and one-click playlist import from Spotify, Apple Music & more." },
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
  ["About", "about"], ["Features", "features"], ["Coupon Codes", "coupon-codes"],
  ["Price", "price"], ["Community Reviews", "community-reviews"], ["Guide", "guide"],
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

const COUPON = LAUNCH_COUPON;
const APP_VERSION = "6.1.1";

function Coupons() {
  const { data: live } = useQuery({ queryKey: ["launch-coupon"], queryFn: () => getLaunchCoupon(), refetchInterval: 30_000 });
  const TOTAL = live?.total ?? LAUNCH_COUPON_SLOTS;
  const CLAIMED = Math.min(live?.claimed ?? 0, TOTAL);
  const [copied, setCopied] = useState(false);
  const [r, setR] = useState([["🔥", "Working", 0], ["❤️", "Loved it", 0], ["⚡", "Instant Unlock", 0]] as [string, string, number][]);
  const [on, setOn] = useState<boolean[]>([false, false, false]);
  const copy = () => {
    navigator.clipboard?.writeText(COUPON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const toggle = (k: number) => {
    setR((p) => p.map((x, j) => (j === k ? [x[0], x[1], x[2] + (on[k] ? -1 : 1)] : x)));
    setOn((p) => p.map((x, j) => (j === k ? !x : x)));
  };
  const pct = (CLAIMED / TOTAL) * 100;
  const tone = couponTone(CLAIMED, TOTAL);
  const toneText = { good: "text-status-good", warn: "text-status-warn", bad: "text-status-bad" }[tone];
  const toneBg = { good: "bg-status-good", warn: "bg-status-warn", bad: "bg-status-bad" }[tone];
  return (
    <div className="card-perimeter mx-auto max-w-xl rounded-2xl p-4 md:p-6">
      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Launch Offer</p>
      <h3 className="mt-1 text-center text-base font-bold md:text-lg">40% Off — 1 Month Plan</h3>
      <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row">
        <div className="w-full flex-1 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-center font-mono text-sm tracking-widest">{COUPON}</div>
        <button onClick={copy} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-85 sm:w-auto">
          {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Code</>}
        </button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs">
          <span className={`flex items-center gap-1.5 font-medium ${toneText}`}><span className={`h-1.5 w-1.5 animate-pulse rounded-full ${toneBg}`} />Active</span>
          <span className={`font-medium ${toneText}`}>{CLAIMED} / {TOTAL} Claimed · {TOTAL - CLAIMED} left</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full transition-all ${toneBg}`} style={{ width: `${pct}%` }} /></div>
      </div>
      <ol className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        {["Download APK", "Open SANORA", "Open Pro Menu", "Apply Code on 1 Month Plan"].map((t, k) => (
          <li key={t} className="rounded-xl border border-border p-2 text-center text-xs">
            <span className="block text-[10px] text-muted-foreground">Step {k + 1}</span>{t}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap justify-center gap-1.5">
        {r.map(([e, l, n], k) => (
          <button key={l} onClick={() => toggle(k)} className={`rounded-full border px-3 py-1.5 text-xs transition ${on[k] ? "border-foreground/40 bg-secondary" : "border-border hover:bg-card"}`}>
            {e} {l} ({n})
          </button>
        ))}
      </div>
    </div>
  );
}

const guide = [
  ["Download the APK", "Tap Download App — Chrome will ask to confirm. Tap 'Download'.", g1],
  ["Keep the File", "Chrome may warn 'This type of file can harm your device'. Tap 'Keep' — our APK is 100% safe & verified.", g2],
  ["Allow Unknown Sources", "When prompted, open Settings and enable 'Allow from this source' for Chrome.", g3],
  ["Install & Enjoy", "Tap 'Install' on the SANORA Music package installer, launch the app and sign in.", g4],
];

const features = [
  [Sliders, "10-Band Parametric Equalizer", "Real-time Web Audio DSP from 32Hz to 16kHz for audiophile acoustic tuning."],
  [Waves, "Deep Bass Boost & Lo-Fi Warmth", "Hardware-calibrated low-shelf punch and vintage analog tape saturation."],
  [Headphones, "320kbps High-Res Audio", "Studio-grade lossless streaming with real-time dynamic bitrate switching."],
  [Shuffle, "Seamless Crossfades", "Apple Music-style smooth gapless playback and natural track transitions."],
  [Sparkles, "Ambient Player Glow", "Full-screen player with responsive, synchronized album art lighting."],
  [Mic2, "Synchronized Real-time Lyrics", "Millisecond-accurate live scrolling with dynamic line tracking."],
  [Moon, "AMOLED Pure Black", "100% battery-saving OLED black mode engineered for modern displays."],
  [DownloadCloud, "Smart Offline Cache", "Instant offline downloads with granular storage tracking and complete cache purge."],
  [Bluetooth, "Bluetooth Route & Battery Display", "Real-time earbud battery percentage and high-resolution codec routing."],
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
      {total === 0 && <p className="text-center text-sm text-muted-foreground">No reviews yet.</p>}
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
  ["Is SANORA free to use?", "Yes. The Free Listener plan gives full catalogue access and playlists. Pro starts at ₹39/month — or 40% off the 1 Month plan with launch code SANORA9184."],
  ["How does the universal playlist import work?", "Paste a playlist link or connect your account. SANORA migrates titles, artists and metadata in one click and matches them to its catalogue — no audio transcoding involved."],
  ["Will my downloaded songs and playlists stay safe across updates?", "Yes. Installing a newer APK over the existing app keeps all your downloads, playlists and settings intact."],
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
        <p className="mt-2 text-xs text-muted-foreground">Version 6.1.1 release with 320kbps High-Res audio, Apple Music-style crossfades, ambient player glow, UPI intent checkout, smart cache manager, and Plus & Pro plans.</p>
      </div>
    </div>
  );
}

const plans = [
  ["Plus (1 Month)", "₹39", "30 Days · Up to 5 imports"],
  ["Pro (2 Months)", "₹69", "60 Days · Unlimited imports · Best value"],
] as const;
const planFeatures = [
  "320kbps Lossless Sound Quality",
  "10-Band Studio EQ, Bass Boost & Crossfade",
  "Universal Playlist Import (Spotify, YT Music & more)",
  "Full-screen Ambient Glow & Synced Lyrics",
  "Smart Offline Cache & Background Playback",
  "VIP Pro Badge & 48-Hour Grace Protection",
];

function Index() {
  return (
    <main className="overflow-x-hidden">
      <header id="about" className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 text-center md:pt-14">
        <img src={logo} alt="SANORA logo" className="h-12 w-12 md:h-14 md:w-14" />
        <span className="mt-3 text-sm font-black tracking-[0.35em]">SANORA</span>
        <h1 className="mt-6 text-2xl font-bold leading-[1.15] md:text-5xl">
          Pure Lossless Sound
          <br />
          Zero Interruptions
          <br />
          <span className="text-gold">Made for True Audiophiles</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm text-subtle md:text-base">The next-generation music streamer built for audiophiles, equipped with studio DSP and universal playlist portability.</p>
        <nav className="mt-6 flex flex-wrap justify-center gap-1.5">
          {nav.map(([l, id]) => (
            <a key={id} href={`#${id}`} className="rounded-full border border-foreground/20 bg-foreground/[0.06] px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-foreground/40 hover:bg-foreground hover:text-background">{l}</a>
          ))}
        </nav>
        <DownloadLink showCount className="btn-perimeter mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-primary-foreground transition hover:scale-[1.02] hover:opacity-90">
          <Android className="h-3.5 w-3.5" />
          <span className="text-sm font-bold">Download App</span>
          <span className="text-[10px] opacity-60">Version {APP_VERSION}</span>
        </DownloadLink>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-green-500">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />100% Virus-Free · Safe & Verified Package · No Adware
        </p>
        <p className="mt-1.5 max-w-sm text-[11px] text-muted-foreground">Trusted by audiophiles across India — no ads, no tracking, no hidden charges.</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-xs font-medium text-subtle transition hover:border-foreground/40 hover:bg-card hover:text-foreground">
          Contact Support <ArrowUpRight className="h-3 w-3" />
        </a>
      </header>

      <div className="mt-4"><Slider /></div>

      <section className="py-10 text-center">
        <h2 className="px-4 text-lg font-bold md:text-2xl">Import Your Library From Anywhere in Seconds</h2>
        <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="marquee flex w-max items-center gap-12">
            {[...brands, ...brands, ...brands, ...brands].map(([name, src], k) => (
              <img key={k} src={src} alt={`${name} logo`} className="h-6 w-auto opacity-70 md:h-8" loading="eager" decoding="async" />
            ))}
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-md px-4 text-xs text-muted-foreground">One-click metadata migration — titles, artists, albums and order — with zero audio transcoding, so your sound stays untouched.</p>
      </section>

      <Section id="coupon-codes" title="Exclusive Coupon Codes"><Coupons /></Section>

      <Section id="guide" title="Install in 4 Steps" sub="For Android users installing outside the Play Store.">
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
        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-green-500"><ShieldCheck className="h-3.5 w-3.5 shrink-0" />100% Virus-Free · Safe & Verified Package · No Adware</p>
      </Section>

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

      <Section id="price" title="Simple, Transparent Pricing">
        <div className="glass mx-auto max-w-md rounded-2xl p-5">
          <div className="divide-y divide-border">
            {plans.map(([n, p, sub]) => (
              <div key={n} className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-semibold">{n}</h3>
                  <p className="text-[11px] text-muted-foreground">{sub}</p>
                </div>
                <p className="text-2xl font-bold">{p}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold text-subtle">All plans include</p>
          <ul className="mt-2 space-y-2 text-xs">
            {planFeatures.map((x) => <li key={x} className="flex gap-1.5"><Check className="h-3.5 w-3.5 shrink-0" />{x}</li>)}
          </ul>
          <a href="#coupon-codes" className="mt-5 block rounded-full bg-primary py-2 text-center text-xs font-semibold text-primary-foreground">Get 40% Off</a>
        </div>
      </Section>

      <Section id="community-reviews" title="Community Reviews"><Reviews /></Section>

      <Section id="faq" title="FAQ & Release Notes"><Faq /></Section>

      <SiteFooter />
    </main>
  );
}
