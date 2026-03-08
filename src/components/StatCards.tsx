import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Activity, Hash, Banknote, Receipt } from "lucide-react";

interface StatCardsProps {
  totalIn: number;
  totalOut: number;
  netBalance: number;
  totalTransactions: number;
  totalFees?: number;
  totalTaxes?: number;
  incomingCount?: number;
  outgoingCount?: number;
}

const formatUGX = (amount: number) =>
  `UGX ${Math.abs(amount).toLocaleString("en-UG")}`;

const StatCards = ({
  totalIn, totalOut, netBalance, totalTransactions,
  totalFees = 0, totalTaxes = 0, incomingCount = 0, outgoingCount = 0
}: StatCardsProps) => {
  const stats = [
    { label: "Total Money In", value: formatUGX(totalIn), icon: ArrowDownLeft, color: "text-chart-green" },
    { label: "Total Money Out", value: formatUGX(totalOut), icon: ArrowUpRight, color: "text-chart-red" },
    { label: "Net Balance", value: formatUGX(netBalance), icon: Activity, color: netBalance >= 0 ? "text-chart-green" : "text-chart-red" },
    { label: "Total Transactions", value: totalTransactions.toString(), icon: Hash, color: "text-foreground", sub: `${incomingCount} in · ${outgoingCount} out` },
    { label: "Total Fees Paid", value: formatUGX(totalFees), icon: Banknote, color: "text-accent" },
    { label: "Total Taxes Paid", value: formatUGX(totalTaxes), icon: Receipt, color: "text-muted" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
          {"sub" in s && s.sub && (
            <p className="text-xs text-muted mt-1">{s.sub}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
