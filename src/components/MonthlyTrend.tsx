import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", moneyIn: 1800000, moneyOut: 1400000 },
  { month: "Feb", moneyIn: 2100000, moneyOut: 1650000 },
  { month: "Mar", moneyIn: 1900000, moneyOut: 1900000 },
  { month: "Apr", moneyIn: 2300000, moneyOut: 1700000 },
  { month: "May", moneyIn: 2000000, moneyOut: 1500000 },
  { month: "Jun", moneyIn: 2500000, moneyOut: 1800000 },
];

const MonthlyTrend = () => {
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
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
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
