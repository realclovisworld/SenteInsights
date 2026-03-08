import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { ParsedTransaction } from "@/lib/pdfParser";

interface IncomeSourcesChartProps {
  transactions: ParsedTransaction[];
}

const IncomeSourcesChart = ({ transactions }: IncomeSourcesChartProps) => {
  const data = useMemo(() => {
    const incomeMap: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type === "received") {
        const sender = t.from?.trim() || t.description?.trim() || "Unknown";
        // Clean up sender name - take first meaningful part
        const name = sender.substring(0, 30);
        incomeMap[name] = (incomeMap[name] || 0) + t.amount;
      }
    }
    return Object.entries(incomeMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="stat-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Income Sources</h3>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => `UGX ${value.toLocaleString("en-UG")}`}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          />
          <Bar dataKey="total" fill="hsl(150, 65%, 29%)" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default IncomeSourcesChart;
