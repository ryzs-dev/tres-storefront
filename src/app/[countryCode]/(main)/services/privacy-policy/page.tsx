"use client"

import Image from "next/image"

const TresPrivacy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-urw text-2xl font-bold text-gray-900">
          PRIVACY POLICY
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          A comprehensive privacy framework template designed for modern
          e-commerce platforms. This demonstrates structured data protection
          policies and transparent user information practices - showcasing
          professional compliance solutions for <strong>TRES</strong>.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Last Updated */}
        <div className="mb-12 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">
            <strong>Last Updated:</strong> [Date]
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            TRES ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website tres.my and
            use our services.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Please read this Privacy Policy carefully. If you do not agree with
            the terms of this Privacy Policy, please do not access or use our
            services.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            2. Information We Collect
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <div className="space-y-1 ml-4">
                <p className="text-gray-700">• Create an account</p>
                <p className="text-gray-700">• Make a purchase</p>
                <p className="text-gray-700">• Subscribe to our newsletter</p>
                <p className="text-gray-700">• Contact our customer support</p>
                <p className="text-gray-700">
                  • Participate in surveys or promotions
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mt-3">
                This may include: name, email address, phone number, shipping
                address, billing address, payment information, and other similar
                contact data.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                When you visit our website, we may automatically collect certain
                information about your device, including:
              </p>
              <div className="space-y-1 ml-4">
                <p className="text-gray-700">• IP address and location data</p>
                <p className="text-gray-700">• Browser type and version</p>
                <p className="text-gray-700">• Operating system</p>
                <p className="text-gray-700">
                  • Pages visited and time spent on our site
                </p>
                <p className="text-gray-700">• Referring website addresses</p>
                <p className="text-gray-700">• Device identifiers</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                2.3 Cookies and Tracking Technologies
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies, web beacons, and similar tracking technologies
                to collect information about your browsing activities and to
                provide personalized experiences. You can control cookie
                settings through your browser preferences.
              </p>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Processing and fulfilling your orders
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Providing customer support and responding to inquiries
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Sending administrative information and order updates
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Personalizing your shopping experience
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Improving our website and services
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Sending marketing communications (with your consent)
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Preventing fraud and ensuring security
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Complying with legal obligations
              </span>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            4. How We Share Your Information
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4.1 Service Providers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may share your information with third-party service providers
                who perform services on our behalf, such as payment processing,
                shipping, email delivery, and website analytics. These providers
                are contractually obligated to protect your information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4.2 Business Transfers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                In the event of a merger, acquisition, or sale of our business,
                your information may be transferred to the new owner as part of
                the business assets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4.3 Legal Requirements
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may disclose your information if required by law, court
                order, or government regulation, or to protect our rights,
                property, or safety, or that of others.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4.4 With Your Consent
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may share your information for any other purpose with your
                explicit consent.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            5. Data Security
          </h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>
            <p className="text-gray-700 leading-relaxed">
              However, please note that no method of transmission over the
              internet or electronic storage is 100% secure. While we strive to
              use commercially acceptable means to protect your information, we
              cannot guarantee absolute security.
            </p>
          </div>
        </div>

        {/* Data Retention */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            6. Data Retention
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law. When we no
            longer need your information, we will securely delete or anonymize
            it.
          </p>
        </div>

        {/* Your Rights */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            7. Your Privacy Rights
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Depending on your location, you may have the following rights
            regarding your personal information:
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Access:</strong> Request access to your personal
                information we hold
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete information
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Portability:</strong> Request transfer of your
                information in a machine-readable format
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Objection:</strong> Object to processing of your
                information for certain purposes
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Restriction:</strong> Request restriction of processing
                in certain circumstances
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mt-4">
            To exercise these rights, please contact us using the information
            provided in Section 12.
          </p>
        </div>

        {/* Marketing Communications */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            8. Marketing Communications
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            With your consent, we may send you marketing emails about new
            products, special offers, and other updates. You can unsubscribe
            from these communications at any time by:
          </p>
          <div className="space-y-1 ml-4">
            <p className="text-gray-700">
              • Clicking the unsubscribe link in any marketing email
            </p>
            <p className="text-gray-700">
              • Updating your preferences in your account settings
            </p>
            <p className="text-gray-700">• Contacting us directly</p>
          </div>
        </div>

        {/* Third-Party Links */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            9. Third-Party Links
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices or content of these external
            sites. We encourage you to review the privacy policies of any
            third-party sites you visit.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            10. Children's Privacy
          </h2>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If we become aware that we have collected personal
              information from a child under 13, we will take steps to delete
              such information promptly.
            </p>
          </div>
        </div>

        {/* International Transfers */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            11. International Data Transfers
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your personal information may be transferred to and processed in
            countries other than your own. When we transfer your information
            internationally, we ensure appropriate safeguards are in place to
            protect your privacy rights in accordance with applicable data
            protection laws.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            12. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our privacy
            practices, please contact us:
          </p>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Privacy Officer</strong>
              <br />
              <strong>Email:</strong>{" "}
              <a
                href="mailto:admin@tres.my"
                className="text-blue-600 hover:underline"
              >
                admin@tres.my
              </a>
              <br />
              <strong>General Support:</strong>{" "}
              <a
                href="mailto:admin@tres.my"
                className="text-blue-600 hover:underline"
              >
                admin@tres.my
              </a>
              <br />
              <strong>Website:</strong>{" "}
              <a
                href="https://tres.my"
                className="text-blue-600 hover:underline"
              >
                tres.my
              </a>
              <br />
              <strong>Address:</strong> 24 Lorong Batu Jelutong Barat 11600
              Jelutong Penang
            </p>
          </div>
        </div>

        {/* Changes to Privacy Policy */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            13. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. When we make
            changes, we will update the "Last Updated" date at the top of this
            policy and notify you of material changes via email or through a
            prominent notice on our website. We encourage you to review this
            Privacy Policy periodically.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            By using our services, you acknowledge that you have read and
            understood this Privacy Policy and agree to our collection, use, and
            disclosure of your information as described herein.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TresPrivacy
