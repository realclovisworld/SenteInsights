import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyBanner = () => {
  return (
    <motion.section
      id="privacy"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="container mx-auto px-4 py-8"
    >
      <div className="bg-primary-light rounded-2xl px-8 py-6 flex items-center gap-4 justify-center">
        <Lock className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-sm md:text-base font-medium text-primary">
          Your data never leaves your browser. We don't store, share, or see your statements.
        </p>
      </div>
    </motion.section>
  );
};

export default PrivacyBanner;
