import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Hireflow's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Hireflow provides an applicant tracking system (ATS) and recruiting software platform that helps organizations manage their hiring processes. Our services include candidate management, job posting, pipeline tracking, team collaboration, and related features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground mb-4">To use our services, you must:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Promptly update your account information as needed</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the service for any unlawful purpose</li>
                <li>Upload malicious code or attempt to breach security</li>
                <li>Interfere with other users' access to the service</li>
                <li>Scrape, copy, or redistribute our content without permission</li>
                <li>Use the service to discriminate against candidates illegally</li>
                <li>Violate any applicable employment or privacy laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data and Privacy</h2>
              <p className="text-muted-foreground">
                Your use of our services is also governed by our Privacy Policy. You are responsible for ensuring that your use of candidate data complies with applicable privacy laws, including obtaining necessary consents and providing required notices to candidates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Subscription and Payment</h2>
              <p className="text-muted-foreground">
                Paid features are billed in advance on a monthly or annual basis. Fees are non-refundable except as required by law. We may change pricing with 30 days' notice. Failure to pay may result in service suspension.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Hireflow and its licensors retain all rights to the service, including software, designs, and content. You retain ownership of data you upload but grant us a license to use it to provide and improve our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Hireflow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                Either party may terminate this agreement at any time. Upon termination, your right to use the service will immediately cease. You may export your data before termination. We may retain certain data as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. We will notify you of material changes via email or through the service. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@hireflow.com" className="text-primary hover:underline">
                  legal@hireflow.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
