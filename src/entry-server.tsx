// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Google Fonts - Preconnect for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
          {/* Async font loading to prevent render blocking */}
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
            media="print"
            onLoad={(e) => {
              (e.currentTarget as HTMLLinkElement).media = "all";
            }}
          />
          <noscript>
            <link
              href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
              rel="stylesheet"
            />
          </noscript>

          {/* PWA Meta Tags */}
          <meta name="application-name" content="Loci" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Loci" />
          <meta
            name="description"
            content="Discover, plan, and explore your next adventure with AI-powered travel recommendations"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#146AFF" />

          {/* Apple Touch Icons */}
          <link rel="apple-touch-icon" href="/images/loci.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/images/loci.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/loci.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="/images/loci.png" />

          {/* Icons */}
          <link rel="icon" type="image/png" sizes="32x32" href="/images/loci.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/loci.png" />
          <link rel="icon" href="/favicon.ico" />

          {/* Manifest */}
          <link rel="manifest" href="/manifest.json" />

          {/* Microsoft */}
          <meta name="msapplication-TileColor" content="#146AFF" />
          <meta name="msapplication-TileImage" content="/images/loci.png" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* Open Graph - Using absolute URLs for better sharing */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Loci - AI Travel Companion" />
          <meta
            property="og:description"
            content="Discover, plan, and explore your next adventure with AI-powered travel recommendations"
          />
          <meta property="og:site_name" content="Loci" />
          <meta property="og:url" content="https://loci.app" />
          <meta property="og:image" content="https://loci.app/images/loci.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter - Using absolute URLs */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Loci - AI Travel Companion" />
          <meta
            name="twitter:description"
            content="Discover, plan, and explore your next adventure with AI-powered travel recommendations"
          />
          <meta name="twitter:image" content="https://loci.app/images/loci.png" />
          <meta name="twitter:site" content="@loci" />
          <meta name="twitter:creator" content="@loci" />

          {/* Theme Initialization Script (Blocking) */}
          {/* eslint-disable-next-line solid/no-innerhtml */}
          <script
            innerHTML={`
              (function() {
                try {
                  var localTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (localTheme === 'dark' || (!localTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-kb-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-kb-theme', 'light');
                  }
                  
                  var designTheme = localStorage.getItem('designTheme');
                  if (designTheme) {
                    document.documentElement.setAttribute('data-theme', designTheme);
                  } else {
                    document.documentElement.setAttribute('data-theme', 'loci');
                  }
                } catch (e) {
                  console.error('Theme init failed', e);
                }
              })();
            `}
          />

          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
