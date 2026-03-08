import { useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SavingsGoalProps {
  netBalance: number;
}

const SavingsGoal = ({ netBalance }: SavingsGoalProps) => {
  const [goal, setGoal] = useState(500000);
  const pct = Math.min(100, Math.max(0, (netBalance / goal) * 100));

  const getMessage = () => {
    if (pct >= 100) return "🎉 Goal reached! You're doing amazing!";
    if (pct >= 75) return "💪 Almost there! Keep it up!";
    if (pct >= 50) return "👍 Halfway there. You're on track!";
    return "🚀 Keep saving, every shilling counts!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="stat-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Savings Goal</h3>
      </div>

      <div className="mb-4">
        <label className="text-xs text-muted mb-1 block">Set your goal (UGX)</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="w-full bg-background border border-border rounded-[10px] px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Progress value={pct} className="h-3 mb-3" />
      <div className="flex justify-between text-xs text-muted font-mono mb-3">
        <span>UGX {netBalance.toLocaleString("en-UG")}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <p className="text-sm font-medium text-foreground">{getMessage()}</p>
    </motion.div>
  );
};

export default SavingsGoal;
