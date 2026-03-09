import { BarChart3, TrendingUp, Target, FileText, Brain, Lock } from "lucide-react";
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
    description: "Visualize how your spending changes month by month with clear line charts.",
  },
  {
    icon: Target,
    title: "Savings Goals",
    description: "Set a target and track progress based on your real transaction data.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Get plain-language summaries of patterns the numbers reveal.",
  },
  {
    icon: FileText,
    title: "CSV Export",
    description: "Download your structured data to use in Excel, Sheets, or any tool.",
  },
  {
    icon: Lock,
    title: "100% Private",
    description: "All processing happens in your browser. Nothing is sent to our servers.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
        className="mb-16 text-center"
      >
        <p className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">Features</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-2xl mx-auto">
          Everything you need to take control
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.44, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white rounded-xl p-6 border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-4 mx-auto"
              style={{
                background: "linear-gradient(135deg, hsl(221,83%,47%), hsl(199,89%,48%))",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
              }}
            >
              <f.icon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2 text-center">
              {f.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed text-center">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
