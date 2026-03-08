import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const insights = [
  "You spent 34% more on airtime in March compared to February.",
  "Your highest spending day was the 15th — likely payday spending.",
  "You could save UGX 45,000/month by reducing transport costs.",
  "Food is your top expense category at 28% of total spending.",
];

const AIInsights = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="stat-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-accent" />
        <h3 className="font-heading font-semibold text-foreground">AI Insights</h3>
      </div>
      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
            className="flex gap-3 text-sm text-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            {insight}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AIInsights;
