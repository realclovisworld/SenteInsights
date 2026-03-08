import { Upload, Brain, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Upload, title: "Upload your PDF statement", step: "01" },
  { icon: Brain, title: "AI reads and categorizes every transaction", step: "02" },
  { icon: BarChart3, title: "Get your full financial picture instantly", step: "03" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5">
              <s.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-xs font-mono font-medium text-muted mb-2 block">STEP {s.step}</span>
            <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
