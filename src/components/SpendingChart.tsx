import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#1A7A4A", "#F4B942", "#3B82F6", "#E5534B", "#8B5CF6", "#6B7280"];

const data = [
  { name: "Food", value: 420000, pct: "28%" },
  { name: "Transport", value: 310000, pct: "21%" },
  { name: "Bills", value: 280000, pct: "19%" },
  { name: "Airtime", value: 180000, pct: "12%" },
  { name: "Savings", value: 150000, pct: "10%" },
  { name: "Other", value: 160000, pct: "10%" },
];

const SpendingChart = () => {
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
            formatter={(value, entry) => {
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
