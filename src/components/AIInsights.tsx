import { useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { ParsedTransaction } from "@/lib/pdfParser";

interface AIInsightsProps {
  transactions: ParsedTransaction[];
}

const AIInsights = ({ transactions }: AIInsightsProps) => {
  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const result: string[] = [];

    const categoryTotals: Record<string, number> = {};
    const incomeSources: Record<string, number> = {};
    let totalOut = 0;
    let totalFees = 0;

    for (const t of transactions) {
      if (t.type === "sent") {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalOut += t.amount;
      } else {
        const sender = t.accountName?.trim() || t.from?.trim() || t.description?.trim() || "Unknown";
        incomeSources[sender] = (incomeSources[sender] || 0) + t.amount;
      }
      totalFees += t.fees;
    }

    // Top category
    const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0) {
      const [topCat, topAmt] = sortedCats[0];
      const pct = totalOut > 0 ? Math.round((topAmt / totalOut) * 100) : 0;
      result.push(`Your top spending category is ${topCat} at ${pct}% of total outgoing (UGX ${topAmt.toLocaleString("en-UG")}).`);
    }

    // Highest spending day
    const dayTotals: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type === "sent") {
        dayTotals[t.date] = (dayTotals[t.date] || 0) + t.amount;
      }
    }
    const sortedDays = Object.entries(dayTotals).sort((a, b) => b[1] - a[1]);
    if (sortedDays.length > 0) {
      const [topDay, dayAmt] = sortedDays[0];
      result.push(`Your highest spending day was ${topDay} with UGX ${dayAmt.toLocaleString("en-UG")} spent.`);
    }

    // Top income source
    const sortedIncome = Object.entries(incomeSources).sort((a, b) => b[1] - a[1]);
    if (sortedIncome.length > 0) {
      const [topSrc, srcAmt] = sortedIncome[0];
      result.push(`Your largest income source is "${topSrc}" with UGX ${srcAmt.toLocaleString("en-UG")} received.`);
    }

    // Fees insight
    if (totalFees > 0) {
      result.push(`You paid UGX ${totalFees.toLocaleString("en-UG")} in transaction fees. Consider consolidating transactions to reduce fees.`);
    }

    // Monthly comparison - dates are YYYY-MM-DD
    const monthTotals: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type === "sent") {
        const parts = t.date.split("-");
        if (parts.length === 3) {
          const monthKey = `${parts[0]}-${parts[1]}`; // YYYY-MM
          monthTotals[monthKey] = (monthTotals[monthKey] || 0) + t.amount;
        }
      }
    }
    const months = Object.entries(monthTotals).sort((a, b) => a[0].localeCompare(b[0])); // chronological sort
    // Only compare if 3+ months to avoid misleading partial-month comparisons
    if (months.length >= 3) {
      const [m1, a1] = months[months.length - 2];
      const [m2, a2] = months[months.length - 1];
      const change = a1 > 0 ? Math.round(((a2 - a1) / a1) * 100) : 0;
      // Cap at 999% — anything higher indicates a parsing anomaly
      const cappedChange = Math.min(Math.abs(change), 999);
      if (change > 0) {
        result.push(`Spending increased by ${cappedChange}% from ${m1} to ${m2}.`);
      } else if (change < 0) {
        result.push(`Spending decreased by ${cappedChange}% from ${m1} to ${m2}.`);
      }
    }

    return result.slice(0, 5);
  }, [transactions]);

  if (insights.length === 0) return null;

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
