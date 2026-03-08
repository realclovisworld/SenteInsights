import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-heading font-bold text-foreground mb-6"
      >
        Terms of Service
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-sm max-w-none space-y-5 text-muted leading-relaxed"
      >
        <p><strong className="text-foreground">Last updated:</strong> March 2026</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">1. Acceptance</h2>
        <p>By using MoMoSense, you agree to these terms. If you do not agree, please do not use the service.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">2. Service Description</h2>
        <p>MoMoSense converts Mobile Money PDF statements into structured data, dashboards, and insights. The service is provided "as-is" and results depend on the quality of your PDF input.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">3. Accounts & Plans</h2>
        <p>Free accounts have daily page limits. Paid plans are activated after manual payment verification and last 30 days from activation. Payments are non-refundable once a plan is activated.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">4. Acceptable Use</h2>
        <p>You may only upload statements that belong to you or that you have authorisation to access. Automated scraping or abuse of the service is prohibited.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">5. Limitation of Liability</h2>
        <p>MoMoSense is not a financial advisor. Insights and data are for informational purposes only. We are not liable for decisions made based on the data provided.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">6. Changes</h2>
        <p>We may update these terms at any time. Continued use after changes constitutes acceptance.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">7. Contact</h2>
        <p>Questions? Email <a href="mailto:hello@momosense.com" className="text-primary hover:underline">hello@momosense.com</a>.</p>
      </motion.div>
    </section>
    <Footer />
  </div>
);

export default Terms;
