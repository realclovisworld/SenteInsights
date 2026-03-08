import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
            Finally understand where your money goes.
          </h1>
          <p className="text-lg text-muted mb-8 max-w-lg">
            Upload your MTN MoMo, Airtel Money, Equity or Stanbic statement and get instant AI-powered insights — free, private, and built for Uganda.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="rounded-[10px] font-heading font-semibold text-base px-8 py-6">
                Upload Statement Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="rounded-[10px] font-heading font-semibold text-base px-8 py-6 border-2">
                See a Demo
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
            <img
              src={heroDashboard}
              alt="MoMoSense dashboard preview showing spending breakdown"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
