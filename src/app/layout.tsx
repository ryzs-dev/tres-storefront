import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@medusajs/ui"
import { RegionProvider } from "context/RegionContext"
import { CartProvider } from "context/CartContext"
import Script from "next/script"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <SpeedInsights />
      {/* Meta Pixel Script */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '882278674201683');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=882278674201683&ev=PageView&noscript=1"
          alt="facebook-pixel"
        />
      </noscript>
      <body className="bg-tres-secondary">
        <RegionProvider>
          <CartProvider>
            <main className="relative bg-tres-secondary">
              {props.children} <Toaster />
            </main>
          </CartProvider>
        </RegionProvider>
      </body>
      <Analytics />
    </html>
  )
}
