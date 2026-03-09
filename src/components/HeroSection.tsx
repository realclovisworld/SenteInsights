import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Upload } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Soft blue radial gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -10%, hsla(221,83%,47%,.15) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-5 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mx-auto"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-2 rounded-full bg-blue-100 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-sm font-medium text-blue-700">Mobile Money Intelligence</span>
          </div>

          {/* Heading — max 2 weights, tight tracking */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground mb-6">
            Finally understand
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, hsl(221,83%,47%), hsl(199,89%,48%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              where your money goes.
            </span>
          </h1>

          {/* Body — single weight, measured line length */}
          <p className="text-lg md:text-xl text-muted leading-[1.65] mb-10 max-w-2xl mx-auto">
            Upload your MTN MoMo or Airtel Money statement and get instant
            AI-powered spending analysis. Free, private, and built for Uganda.
          </p>

          {/* CTAs - Centered and Stacked */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-[12px] h-12 px-8 gap-2 hover:shadow-xl transition-all text-base"
              >
                <Upload className="w-5 h-5" strokeWidth={2} />
                Upload Statement Free
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </Button>
            </Link>
            <a href="#faq" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-base font-semibold text-foreground rounded-[12px] h-12 px-8 border-2 border-blue-200 bg-white hover:bg-blue-50 transition-colors"
              >
                Learn How It Works
              </Button>
            </a>
          </div>

          {/* Trust signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={2} />
            <span className="text-sm text-muted">
              Your data never leaves your browser. No storage, no sharing.
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
