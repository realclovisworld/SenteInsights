import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-heading font-bold text-foreground mb-6"
      >
        Privacy Policy
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-sm max-w-none space-y-5 text-muted leading-relaxed"
      >
        <p><strong className="text-foreground">Last updated:</strong> March 2026</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">1. What We Collect</h2>
        <p>When you create an account, we store your email address, name, and plan details. Transaction summaries and insights are stored in your account for your convenience.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">2. PDF Statement Processing</h2>
        <p>Your PDF files are parsed entirely in your browser. We <strong className="text-foreground">never</strong> upload, transmit, or store your original PDF files on any server. Only the extracted summary data (totals, categories, transaction records) is saved to your account if you are logged in.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">3. Payment Information</h2>
        <p>We collect Mobile Money transaction IDs for payment verification only. We do not store your Mobile Money PIN or account credentials.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">4. Data Sharing</h2>
        <p>We do not sell, rent, or share your personal data with third parties. We use Supabase for secure data storage and Clerk for authentication.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">5. Data Deletion</h2>
        <p>You can request deletion of your account and all associated data by contacting us at <a href="mailto:hello@momosense.com" className="text-primary hover:underline">hello@momosense.com</a>.</p>

        <h2 className="text-lg font-heading font-semibold text-foreground">6. Contact</h2>
        <p>For privacy-related questions, email <a href="mailto:hello@momosense.com" className="text-primary hover:underline">hello@momosense.com</a>.</p>
      </motion.div>
    </section>
    <Footer />
  </div>
);

export default Privacy;
