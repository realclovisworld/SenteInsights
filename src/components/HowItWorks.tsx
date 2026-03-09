import { Upload, Brain, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Upload your PDF statement",
    body: "Drag and drop your MTN MoMo or Airtel Money PDF. It stays in your browser.",
    step: "01",
  },
  {
    icon: Brain,
    title: "AI reads every transaction",
    body: "Our parser categorizes each entry — payments, top-ups, withdrawals, fees.",
    step: "02",
  },
  {
    icon: BarChart3,
    title: "Your full financial picture",
    body: "Get charts, trends, savings analysis, and an exportable CSV in seconds.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="container mx-auto px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
        className="mb-12"
      >
        <p className="eyebrow mb-3">How it works</p>
        <h2 className="text-[2rem] md:text-[2.4rem] font-bold tracking-[-0.022em] text-foreground">
          Three steps to clarity
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.44, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex gap-5"
          >
            {/* Step number + icon */}
            <div className="flex flex-col items-center">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, hsl(221,83%,47%), hsl(199,89%,48%))",
                  boxShadow: "0 4px 14px rgba(26,82,219,.28)",
                }}
              >
                <s.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block w-px flex-1 mt-3 bg-gradient-to-b from-primary/25 to-transparent" />
              )}
            </div>

            <div className="pt-1.5 pb-6">
              <span className="eyebrow block mb-1">STEP {s.step}</span>
              <h3 className="text-[0.9375rem] font-semibold text-foreground mb-1.5 tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="text-[0.8125rem] text-muted leading-relaxed">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
