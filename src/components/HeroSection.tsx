import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
          Finally understand where your money goes.
        </h1>
        <p className="text-lg text-muted mb-8 max-w-lg">
          Upload your MTN MoMo or Airtel Money statement and get instant AI-powered insights — free, private, and built for Uganda.
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
    </section>
  );
};

export default HeroSection;
