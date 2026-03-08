import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import type { ParsedTransaction } from "@/lib/pdfParser";

interface MonthlyTrendProps {
  transactions?: ParsedTransaction[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthlyTrend = ({ transactions = [] }: MonthlyTrendProps) => {
  const data = useMemo(() => {
    const monthMap: Record<string, { moneyIn: number; moneyOut: number }> = {};
    for (const t of transactions) {
      // Try to extract month from date (supports DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY)
      let month = "";
      const parts = t.date.split(/[\/-]/);
      if (parts.length === 3) {
        let monthNum: number;
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          monthNum = parseInt(parts[1]);
        } else {
          // DD/MM/YYYY or DD-MM-YYYY
          monthNum = parseInt(parts[1]);
        }
        if (monthNum >= 1 && monthNum <= 12) {
          month = MONTHS[monthNum - 1];
        }
      }
      if (!month) continue;

      if (!monthMap[month]) monthMap[month] = { moneyIn: 0, moneyOut: 0 };
      if (t.type === "received") {
        monthMap[month].moneyIn += t.amount;
      } else {
        monthMap[month].moneyOut += t.amount;
      }
    }

    return Object.entries(monthMap).map(([month, vals]) => ({ month, ...vals }));
  }, [transactions]);

  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="stat-card"
    >
      <h3 className="font-heading font-semibold text-foreground mb-4">Monthly Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 18% 91%)" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value: number) => `UGX ${value.toLocaleString("en-UG")}`}
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          />
          <Legend />
          <Line type="monotone" dataKey="moneyIn" stroke="#1A7A4A" strokeWidth={2.5} dot={{ r: 4 }} name="Money In" />
          <Line type="monotone" dataKey="moneyOut" stroke="#E5534B" strokeWidth={2.5} dot={{ r: 4 }} name="Money Out" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default MonthlyTrend;
