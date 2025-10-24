export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using BeatSlave Market, you accept and agree to be
            bound by the terms and provision of this agreement. If you do not
            agree to these Terms of Service, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p className="text-muted-foreground">
            Permission is granted to temporarily download one copy of the
            materials (beats/instrumentals) on BeatSlave Market for personal or
            commercial use subject to the specific license type purchased. This
            is the grant of a license, not a transfer of title.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Purchase and Payment</h2>
          <p className="text-muted-foreground mb-2">
            All purchases are processed securely through Stripe. By completing a
            purchase, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>Provide accurate billing and contact information</li>
            <li>Pay all charges at the prices in effect when incurred</li>
            <li>Accept the specific license terms for your purchase</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Downloads</h2>
          <p className="text-muted-foreground">
            Download links are valid for 24 hours from the time of purchase. You
            may download your purchased tracks multiple times within this
            period. After expiration, please contact support for assistance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Refund Policy</h2>
          <p className="text-muted-foreground">
            Due to the digital nature of our products, all sales are final. We
            do not offer refunds once a download link has been provided. Please
            preview tracks before purchasing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All beats, instrumentals, and associated materials are protected by
            copyright. The purchase of a license does not transfer ownership of
            the underlying composition or recording.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            BeatSlave Market shall not be liable for any damages arising from
            the use or inability to use our materials, even if we have been
            notified of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p className="text-muted-foreground">
            For questions about these Terms of Service, please contact us at{" "}
            <a
              href="mailto:dalvarez@sotsvc.com"
              className="text-primary hover:underline"
            >
              dalvarez@sotsvc.com
            </a>
          </p>
        </section>

        <div className="pt-8 border-t text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Version: 1.0</p>
        </div>
      </div>
    </div>
  );
}
