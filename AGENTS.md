<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Legal pages
- Keep visitor review pagination in URL search state and fetch counted, ordered database ranges; never cap the full review collection or seed sample reviews.
- Keep legal documents in a browser-safe shared content module and render them through one shared legal layout, so security notices and navigation stay consistent without server dependencies.
- Keep each legal document on its own static route with unique head metadata; preserve the older `/legal/$page` URLs as redirects so existing links keep working.
- Use the shared SiteFooter for homepage and legal pages so official download, support, and Legal & Safety navigation stay synchronized.

## Download tracking
- All APK links use the shared DownloadLink to record initiation events, not completed installs, and refresh the public counter consistently.
- Keep download events append-only behind narrowly scoped database functions with idempotent event IDs; clients must never set the total or read individual events.
- React Bits registries use environment-variable license headers; never commit a license value or imitate a paid component when installation is blocked.

## Payments
- Razorpay endpoints and coupon lookups live under /api/public/* with an origin allowlist for sanoramusic.in and Capacitor, because the mobile app calls them cross-origin and server functions are CSRF-protected.
- Payments, coupons, and subscriptions use the SANORA app database via a server-only service client (src/lib/sanora.server.ts); the plan and user are read from the Razorpay order notes, never from the client.
- Plan prices and coupon rules live in the browser-safe src/lib/pricing.ts so the site and endpoints share one source.
