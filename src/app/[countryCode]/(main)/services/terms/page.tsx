"use client"

import Image from "next/image"

const TresTerms = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-urw text-2xl font-bold text-gray-900">
          TERMS AND CONDITIONS
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          A comprehensive legal framework template designed for e-commerce
          platforms. This demonstrates structured legal documentation and clear
          policy presentation - showcasing professional web development
          solutions for <strong>TRES</strong>.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Last Updated */}
        <div className="mb-12 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">
            <strong>Last Updated:</strong> 4/10/2025
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to TRES ("we," "our," or "us"). These Terms and Conditions
            ("Terms") govern your use of our website located at tres.my and any
            related services provided by TRES.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using our service, you agree to be bound by these
            Terms. If you disagree with any part of these terms, then you may
            not access the service.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            2. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By creating an account, making a purchase, or using any part of our
            service, you acknowledge that you have read, understood, and agree
            to be bound by these Terms and our Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms at any time. Changes will
            be effective immediately upon posting on our website. Your continued
            use of the service after changes are posted constitutes acceptance
            of those changes.
          </p>
        </div>

        {/* Use of Service */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            3. Use of Service
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3.1 Eligibility
              </h3>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 18 years old to use our service. By using
                our service, you represent and warrant that you meet this age
                requirement.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3.2 Account Registration
              </h3>
              <p className="text-gray-700 leading-relaxed">
                You may be required to create an account to access certain
                features. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3.3 Prohibited Uses
              </h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                You agree not to use the service:
              </p>
              <div className="space-y-1 ml-4">
                <p className="text-gray-700">
                  • For any unlawful purpose or to solicit others to perform
                  unlawful acts
                </p>
                <p className="text-gray-700">
                  • To violate any international, federal, provincial, or state
                  regulations, rules, laws, or local ordinances
                </p>
                <p className="text-gray-700">
                  • To infringe upon or violate our intellectual property rights
                  or the intellectual property rights of others
                </p>
                <p className="text-gray-700">
                  • To harass, abuse, insult, harm, defame, slander, disparage,
                  intimidate, or discriminate
                </p>
                <p className="text-gray-700">
                  • To submit false or misleading information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products and Orders */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            4. Products and Orders
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4.1 Product Information
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We strive to provide accurate product descriptions, images, and
                pricing. However, we do not warrant that product descriptions or
                other content is accurate, complete, reliable, current, or
                error-free.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4.2 Order Acceptance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All orders are subject to acceptance and availability. We
                reserve the right to refuse or cancel any order for any reason,
                including but not limited to product availability, errors in
                product or pricing information, or suspected fraud.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4.3 Pricing</h3>
              <p className="text-gray-700 leading-relaxed">
                All prices are subject to change without notice. We reserve the
                right to modify prices at any time. However, if you have already
                placed an order, the price at the time of order confirmation
                will apply.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            5. Payment Terms
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              Payment must be received prior to shipment of products. We accept
              various payment methods as displayed during checkout.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By providing payment information, you represent and warrant that
              you are authorized to use the payment method and authorize us to
              charge the total amount of your order.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All transactions are processed securely through trusted payment
              processors. We do not store your complete payment information on
              our servers.
            </p>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            6. Shipping and Delivery
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              Shipping terms, costs, and delivery timeframes are as specified in
              our Shipping Policy. Risk of loss and title for products pass to
              you upon delivery to the shipping carrier.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are not responsible for delays caused by shipping carriers,
              customs, or other factors beyond our control.
            </p>
          </div>
        </div>

        {/* Returns and Refunds */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            7. Returns and Refunds
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our return and refund policy is detailed in our separate Return
            Policy document. By making a purchase, you agree to the terms
            outlined in that policy.
          </p>
        </div>

        {/* Intellectual Property */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            8. Intellectual Property Rights
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              The service and its original content, features, and functionality
              are and will remain the exclusive property of TRES and its
              licensors. The service is protected by copyright, trademark, and
              other laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works
              of, publicly display, publicly perform, republish, download,
              store, or transmit any of the material on our service without our
              prior written consent.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            9. Limitation of Liability
          </h2>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>IMPORTANT:</strong> To the maximum extent permitted by
              applicable law, in no event shall TRES, its affiliates, officers,
              directors, employees, or agents be liable for any indirect,
              incidental, special, consequential, or punitive damages.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our total liability to you for all damages, losses, and causes of
              action shall not exceed the amount paid by you for the specific
              product or service that gave rise to the claim.
            </p>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            10. Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. Please review our Privacy Policy,
            which also governs your use of the service, to understand our
            practices regarding the collection and use of your personal
            information.
          </p>
        </div>

        {/* Termination */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            11. Termination
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the service
              immediately, without prior notice, for any reason, including
              breach of these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the service will cease
              immediately, but all provisions of these Terms which by their
              nature should survive termination shall survive.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            12. Governing Law
          </h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of Malaysia, without regard to its conflict of law
            provisions. Any disputes arising from these Terms shall be subject
            to the exclusive jurisdiction of the courts of Malaysia.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            13. Changes to Terms
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify or replace these Terms at any time.
            If a revision is material, we will try to provide at least 30 days
            notice prior to any new terms taking effect. What constitutes a
            material change will be determined at our sole discretion.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            14. Contact Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about these Terms and Conditions, please
            contact us:
          </p>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong>{" "}
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

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            By using our service, you acknowledge that you have read and
            understood these Terms and Conditions and agree to be bound by them.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TresTerms
