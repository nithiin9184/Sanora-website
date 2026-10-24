# SANORA Music Portal

First mock data tho continue chy !

Build the official high-end web landing and APK distribution portal for SANORA Music at sanoramusic.in.

Strict Visual & Design Rules:

- Background: 100% Pure AMOLED Black (#000000) across all sections and viewports.

- Color Palette: Strictly Black, Charcoal (#111111, #1a1a1a), and subtle monochromatic Grays (#8e8e93, #a1a1aa, #ffffff). NO neon colors, NO harsh saturated gradients.

- Typography: Ultra-clean modern sans-serif (Inter or Geist), bold headlines, tight letter spacing, clean hierarchy.

- Accents: Glassmorphism cards with fine 1px dark borders (border-white/10), subtle backdrop blur, and smooth monochromatic hover states.

- Responsive: Perfectly optimized for both mobile screens and desktop viewports.

1. Top Centered Hero Section (Clean Minimalist Center Alignment):

- Absolutely no asymmetrical left-vs-right splits. Everything centered with balanced breathing room:

  - SANORA wordmark/logo centered at the top.

  - 2-line centered tagline:

    "Pure Lossless Sound. Zero Interruptions."

    "The next-generation music streamer built for audiophiles, equipped with studio DSP and universal playlist portability."

  - Horizontal row of centered rounded pill buttons with smooth anchor scrolling:

    [ About ] [ Features ] [ Coupon Codes ] [ Price ] [ Community Reviews ] [ Guide ]

  - Centered primary action: Large rounded "Download App" CTA button featuring an Android icon, "Download APK (v1.0.0 · ~28 MB)", and instant link to /download/sanora.apk.

2. Center-Focus Continuous Screenshot Slider:

- Placed immediately below the Download button.

- Behavior: An automated, ultra-smooth continuous slider showing the 6 app screenshot mockups.

- Animation style: The current center phone slide is large, prominent, and crisp. After a few seconds, it smoothly transitions to the side scaling down, while the next slide smoothly scales up into the center spotlight.

- Critical requirement: The automatic slide animation must NEVER pause or freeze when touched, clicked, hovered, or dragged by the user. It cycles continuously in an infinite loop.

3. Universal Platform Portability Strip:

- Centered header: "Import Your Library From Anywhere in Seconds"

- Clean, grayscale/monochrome high-resolution official brand logos side-by-side in a smooth infinite marquee or elegant row:

  Spotify | Apple Music | JioSaavn | Gaana | Amazon Music

- Sub-text explaining one-click metadata migration without audio transcoding.

4. Exclusive Coupon Codes Hub (Interactive):

- Section ID: #coupon-codes

- Highlight card for current active promotion (e.g. Code: "SANORAPRO100" - 100% Lifetime VIP Pro Free).

- Card Elements:

  - Promo code displayed in monospace font inside a clean glass container.

  - 1-Click "Copy Code" button with instant checkmark feedback ("Copied to Clipboard!").

  - Live availability indicator: "Active · 482 / 500 Claimed" with a subtle progress bar.

  - 4-Step instruction strip:

    1. Download APK -> 2. Open SANORA -> 3. Open Pro Menu -> 4. Paste Code for Instant Pro.

  - Live Reaction counters with interactive toggle buttons:

    - [ 🔥 Working (342) ]

    - [ ❤️ Loved it (189) ]

    - [ ⚡ Instant Unlock (210) ]

    (Allow users to click and increment reaction counters saved in local state / Supabase).

5. Complete APK Installation Step-by-Step Guide:

- Section ID: #guide

- Designed specifically for Android users downloading outside the Play Store.

- 4 clear visual step cards featuring phone UI mockup frames:

  - Step 1: "Download the APK" -> Click the Download button from your browser (Chrome/Brave).

  - Step 2: "Allow Unknown Sources" -> Tap 'Settings' when prompted with 'File might be harmful' and enable 'Allow from this source'.

  - Step 3: "Install & Launch" -> Tap 'Install' and launch SANORA Music.

  - Step 4: "Log In & Enjoy" -> Sign in seamlessly with Google and access 80M+ songs.

- Direct APK release note: Verified distribution package.

6. Features & Studio Specs Breakdown:

- Section ID: #features

- Minimalist grid of dark glassmorphic cards:

  - 10-Band Parametric Equalizer: Real-time Web Audio DSP from 32Hz to 16kHz.

  - Deep Bass Boost & Lo-Fi Warmth: Hardware-calibrated low-shelf punch and vintage tape saturation.

  - Synchronized Real-time Lyrics: Millisecond-accurate live scrolling.

  - AMOLED Pure Black: 100% battery-saving OLED black mode.

  - Bluetooth Route & Battery Display: Real-time earbud battery percentage.

7. Transparent Pricing & Pro Plans:

- Section ID: #price

- Minimalist comparison between "Free Listener" and "SANORA Pro":

  - Free: Standard bitrate, full catalogue access, playlists.

  - Pro (₹0 with launch coupon / ₹99 lifetime): 320kbps High-Res, Studio EQ & FX, Unlimited Playlist Imports, VIP Badge.

8. Community Reviews & Live Reaction Board:

- Section ID: #community-reviews

- Real-time user feedback cards with star ratings, listener names, and concise impressions.

- Interactive "Leave a Review" modal/form allowing visitors to submit their own feedback and rating.

9. Version Notes, Release History & FAQ:

- Accordion FAQ addressing common questions:

  - "Is SANORA free to use?"

  - "How does the universal playlist import work?"

  - "Will my downloaded songs and playlists stay safe across updates?"

- Version release card:

  - v1.0.0 (Release: October 2026): Initial public release with Universal Playlist Import, Studio FX Engine, and AMOLED pure black architecture.

10. Minimalist Footer:

- Direct APK download fallback link.

- Copyright © 2026 SANORA Music. All rights reserved.- Clean text links: Privacy Policy, Terms of Service, DMCA Disclaimer, Contact Support.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8665afc6-f8e5-40d0-ba2c-cbdcbe709b12).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
