import { Link } from "@tanstack/react-router";
import logo from "@/assets/sanora-logo.webp";
import { DownloadLink } from "@/components/download-link";
import { ArrowUpRight } from "lucide-react";
import { InstagramLogo } from "@/components/instagram-logo";

const INSTAGRAM_URL = "https://www.instagram.com/sanoramusicofficial?exln=MWZ2ZjE4Y3djZXh1eg==";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-10 text-sm text-muted-foreground">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[1.2fr_auto_auto] sm:gap-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 font-semibold text-foreground">
            <img src={logo} alt="" className="h-8 w-8" /> SANORA Music
          </Link>
          <p className="mt-3 text-xs leading-relaxed max-w-xs text-muted-foreground">
            Independent client-side Android audio player &amp; playlist metadata manager.
          </p>
          <div className="mt-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-card/40 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-foreground/40 hover:text-foreground"
            >
              <InstagramLogo className="h-3.5 w-3.5 shrink-0 rounded-[3px]" />
              <span>@sanoramusicofficial</span>
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </a>
          </div>
          <p className="mt-4 text-xs">Copyright © 2026 SANORA Music. All rights reserved.</p>
        </div>
        <nav aria-label="Downloads and community" className="flex flex-col items-start gap-3 text-xs">
          <h2 className="text-sm font-semibold text-foreground">Official SANORA</h2>
          <DownloadLink className="underline-offset-4 hover:text-foreground hover:underline">Direct APK download</DownloadLink>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 underline-offset-4 hover:text-foreground hover:underline"
          >
            <InstagramLogo className="h-3.5 w-3.5 shrink-0 rounded-[3px]" />
            <span>Instagram (Coupons &amp; Updates)</span>
          </a>
          <a href="mailto:support@sanoramusic.in" className="underline-offset-4 hover:text-foreground hover:underline">Contact Support</a>
        </nav>
        <nav aria-label="Legal & Safety" className="flex flex-col items-start gap-3 text-xs">
          <h2 className="text-sm font-semibold text-foreground">Legal &amp; Safety</h2>
          <Link to="/privacy-policy" className="underline-offset-4 hover:text-foreground hover:underline">Privacy Policy</Link>
          <Link to="/terms-of-service" className="underline-offset-4 hover:text-foreground hover:underline">Terms of Service</Link>
          <Link to="/dmca" className="underline-offset-4 hover:text-foreground hover:underline">DMCA &amp; Copyright Disclaimer</Link>
        </nav>
      </div>
    </footer>
  );
}
