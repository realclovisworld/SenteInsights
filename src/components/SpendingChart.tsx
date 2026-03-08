import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";
import type { ParsedTransaction } from "@/lib/pdfParser";

const COLORS = ["#1A7A4A", "#F4B942", "#3B82F6", "#E5534B", "#8B5CF6", "#6B7280"];

interface SpendingChartProps {
  transactions?: ParsedTransaction[];
}

const SpendingChart = ({ transactions = [] }: SpendingChartProps) => {
  const data = useMemo(() => {
    const catMap: Record<string, number> = {};
    let total = 0;
    for (const t of transactions) {
      if (t.type === "sent") {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        total += t.amount;
      }
    }
    return Object.entries(catMap)
      .map(([name, value]) => ({ name, value, pct: total > 0 ? `${((value / total) * 100).toFixed(0)}%` : "0%" }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="stat-card"
    >
      <h3 className="font-heading font-semibold text-foreground mb-4">Spending Categories</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `UGX ${value.toLocaleString("en-UG")}`}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          />
          <Legend
            formatter={(value) => {
              const item = data.find((d) => d.name === value);
              return `${value} (${item?.pct})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SpendingChart;
