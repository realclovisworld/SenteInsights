import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyBanner = () => {
  return (
    <motion.section
      id="privacy"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="container mx-auto px-5 py-8"
    >
      <div
        className="rounded-xl px-7 py-5 flex items-center justify-center gap-4 text-center"
        style={{
          background: "linear-gradient(135deg, hsl(220,100%,96%) 0%, hsl(199,100%,95%) 100%)",
          border: "1px solid hsl(221,83%,47%,.14)",
        }}
      >
        <div
          className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--primary-light))", border: "1px solid hsl(221,83%,47%,.18)" }}
        >
          <ShieldCheck className="w-4.5 h-4.5 text-primary" strokeWidth={2} />
        </div>
        <p className="text-sm font-medium text-foreground leading-snug">
          Your data never leaves your browser.
          <span className="text-muted font-normal"> We don't store, share, or see your statements.</span>
        </p>
      </div>
    </motion.section>
  );
};

export default PrivacyBanner;
