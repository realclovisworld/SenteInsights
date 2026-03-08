import { BarChart3, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BarChart3,
    title: "Spending Breakdown",
    description: "See exactly where your money goes across food, transport, bills, and more.",
  },
  {
    icon: TrendingUp,
    title: "Monthly Trends",
    description: "Visualize how your spending changes month by month.",
  },
  {
    icon: Target,
    title: "Savings Goals",
    description: "Set a target and track how close you are based on your real data.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Everything you need to take control
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="bg-surface rounded-2xl p-8 shadow-card text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-5">
              <f.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">{f.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
