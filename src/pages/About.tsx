import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Target, Heart, MapPin } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-heading font-bold text-foreground mb-6"
      >
        About SenteInsights
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 text-muted leading-relaxed"
      >
        <p>
          SenteInsights is a Ugandan-built tool that turns your Mobile Money PDF statements into
          clear, actionable financial insights. We believe everyone deserves to understand their
          money — without needing a finance degree.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 py-4">
          {[
            { icon: Target, title: "Our Mission", text: "Make personal financial data accessible and useful for every Ugandan." },
            { icon: Users, title: "Who We Serve", text: "Individuals, freelancers, and small businesses who use MTN MoMo or Airtel Money daily." },
            { icon: Heart, title: "Privacy First", text: "Your statements are processed in your browser. We never upload or store your PDF files." },
            { icon: MapPin, title: "Built in Uganda", text: "Designed and developed in Kampala for the Ugandan market, with UGX pricing." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-surface border border-border rounded-xl p-5">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-heading font-semibold text-foreground text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted">{text}</p>
            </div>
          ))}
        </div>

        <p>
          Have questions or feedback? Reach out at{" "}
          <a href="mailto:hello@senteinsights.com" className="text-primary hover:underline">
            hello@senteinsights.com
          </a>
        </p>
      </motion.div>
    </section>
    <Footer />
  </div>
);

export default About;
