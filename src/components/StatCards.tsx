import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Activity, Hash } from "lucide-react";

interface StatCardsProps {
  totalIn: number;
  totalOut: number;
  netBalance: number;
  totalTransactions: number;
}

const formatUGX = (amount: number) =>
  `UGX ${Math.abs(amount).toLocaleString("en-UG")}`;

const StatCards = ({ totalIn, totalOut, netBalance, totalTransactions }: StatCardsProps) => {
  const stats = [
    { label: "Total Money In", value: formatUGX(totalIn), icon: ArrowDownLeft, color: "text-chart-green" },
    { label: "Total Money Out", value: formatUGX(totalOut), icon: ArrowUpRight, color: "text-chart-red" },
    { label: "Net Balance", value: formatUGX(netBalance), icon: Activity, color: netBalance >= 0 ? "text-chart-green" : "text-chart-red" },
    { label: "Total Transactions", value: totalTransactions.toString(), icon: Hash, color: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="stat-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <span className="text-xs text-muted font-medium">{s.label}</span>
          </div>
          <p className={`data-value ${s.color}`}>{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
