import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@medusajs/ui"
import { RegionProvider } from "context/RegionContext"
import { CartProvider } from "context/CartContext"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <SpeedInsights />
      <body>
        <RegionProvider>
          <CartProvider>
            <main className="relative">
              {props.children} <Toaster />
            </main>
          </CartProvider>
        </RegionProvider>
      </body>
      <Analytics />
    </html>
  )
}
