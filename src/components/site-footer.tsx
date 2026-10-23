import { Link } from "@tanstack/react-router";
import logo from "@/assets/sanora-logo.webp";
import { DownloadLink } from "@/components/download-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-10 text-sm text-muted-foreground">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-[1fr_auto_auto] sm:gap-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 font-semibold text-foreground">
            <img src={logo} alt="" className="h-8 w-8" /> SANORA Music
          </Link>
          <p className="mt-4 text-xs">Copyright © 2026 SANORA Music. All rights reserved.</p>
        </div>
        <nav aria-label="Downloads and support" className="flex flex-col items-start gap-3 text-xs">
          <h2 className="text-sm font-semibold text-foreground">Official SANORA</h2>
          <DownloadLink className="underline-offset-4 hover:text-foreground hover:underline">Direct APK download</DownloadLink>
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