import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default function Footer() {
  // Hardcoded categories
  const categories = [
    { name: "Tops", handle: "tops" },
    { name: "Dresses", handle: "dresses" },
    { name: "Sets", handle: "sets" },
  ]

  // Hardcoded collections
  const collections = [
    { title: "Pedal & Power", handle: "pedal-and-power" },
    { title: "Chill in Style", handle: "chill-in-style" },
    { title: "Cover Me Up", handle: "cover-me-up" },
    { title: "Smash & Swing", handle: "smash-and-swing" },
  ]

  const serviceLinks = [
    { name: "TRES Care", href: "/services/tres-care" },
    { name: "TRES Sizing Guide", href: "/services/size-guide" },
    { name: "Model Introduction", href: "/services/model-introduction" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Shipping & Return Policy", href: "/services/shipping-return" },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between py-16 gap-12">
          {/* Logo and Brand Section */}
          <div className="flex-shrink-0 lg:max-w-xs">
            <LocalizedClientLink href="/" className="inline-block">
              <Image
                src="/images/tres-logo-3.svg"
                alt="Tres Exclusive Empire"
                width={85}
                height={85}
                className="transition-all hover:scale-105 duration-300 drop-shadow-sm"
              />
            </LocalizedClientLink>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Discover exclusive collections and premium categories at Tres
              Exclusive Empire.
            </p>
          </div>

          {/* Footer Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 flex-1">
            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-gray-900 font-semibold text-base tracking-wide uppercase">
                Categories
              </h4>
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c.handle}>
                    <LocalizedClientLink
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium relative group"
                      href={`/categories/${c.handle}`}
                    >
                      {c.name}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections */}
            <div className="space-y-4">
              <h4 className="text-gray-900 font-semibold text-base tracking-wide uppercase">
                Collections
              </h4>
              <ul className="space-y-3">
                {collections.map((c) => (
                  <li key={c.handle}>
                    <LocalizedClientLink
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium relative group"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-gray-900 font-semibold text-base tracking-wide uppercase">
                Services
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium relative group"
                      href={link.href}
                    >
                      {link.name}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-medium">
              © {new Date().getFullYear()} TRES EXCLUSIVE EMPIRE. All rights
              reserved.
            </p>

            {/* Optional: Add social links or additional info */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <LocalizedClientLink
                href="/privacy-policy"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Privacy Policy
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/terms-of-service"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Terms of Service
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/contact"
                className="hover:text-gray-900 transition-colors duration-200"
              >
                Contact Us
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
