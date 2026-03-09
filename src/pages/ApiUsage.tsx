import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Code, Lock, Zap } from "lucide-react";

const ApiUsage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-heading font-bold text-foreground mb-6"
      >
        API Usage
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 text-muted leading-relaxed"
      >
        <p>
          The SenteInsights API allows Business and Enterprise plan subscribers to programmatically
          access statement parsing and financial insights.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 py-2">
          {[
            { icon: Code, title: "RESTful API", text: "Simple JSON endpoints for uploading and retrieving parsed data." },
            { icon: Lock, title: "Authenticated", text: "API keys scoped to your account with rate limiting per plan." },
            { icon: Zap, title: "Fast Processing", text: "Parse statements and receive structured JSON in seconds." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-surface border border-border rounded-xl p-5">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-2">Coming Soon</h3>
          <p className="text-sm">
            API access is currently in development. Business and Enterprise plan holders will
            receive early access. Interested?{" "}
            <a href="mailto:hello@senteinsights.com" className="text-primary hover:underline">
              Contact us
            </a>{" "}
            to join the waitlist.
          </p>
        </div>
      </motion.div>
    </section>
    <Footer />
  </div>
);

export default ApiUsage;
