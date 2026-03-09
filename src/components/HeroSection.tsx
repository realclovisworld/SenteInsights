import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import FileUpload from "@/components/FileUpload";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    // Navigate to dashboard with file, which will be handled by the Dashboard component
    localStorage.setItem("pendingFile", file.name);
    navigate("/dashboard");
  };

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

      <div className="container mx-auto px-5 pt-20 pb-16 md:pt-28 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-2 rounded-full bg-blue-100 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-sm font-medium text-blue-700">Mobile Money Intelligence</span>
          </div>

          {/* Heading */}
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

          {/* Body */}
          <p className="text-lg md:text-xl text-muted leading-[1.65] mb-10 max-w-2xl mx-auto">
            Upload your MTN MoMo or Airtel Money statement and get instant
            AI-powered spending analysis. Free, private, and built for Uganda.
          </p>
        </motion.div>

        {/* File Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mx-auto mb-8"
        >
          <FileUpload onFileSelect={handleFileSelect} />
        </motion.div>

        {/* Trust signal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center justify-center gap-2"
        >
          
          
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
