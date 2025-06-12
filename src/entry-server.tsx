// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* PWA Meta Tags */}
          <meta name="application-name" content="Loci" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Loci" />
          <meta name="description" content="Discover, plan, and explore your next adventure with AI-powered travel recommendations" />
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
          
          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Loci - AI Travel Companion" />
          <meta property="og:description" content="Discover, plan, and explore your next adventure with AI-powered travel recommendations" />
          <meta property="og:site_name" content="Loci" />
          <meta property="og:url" content="https://loci.app" />
          <meta property="og:image" content="/images/loci.png" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Loci - AI Travel Companion" />
          <meta name="twitter:description" content="Discover, plan, and explore your next adventure with AI-powered travel recommendations" />
          <meta name="twitter:image" content="/images/loci.png" />
          
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
