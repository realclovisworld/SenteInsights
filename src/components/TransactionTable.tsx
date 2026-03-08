import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Transaction {
  date: string;
  description: string;
  type: "sent" | "received";
  amount: number;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-chart-green/15 text-chart-green",
  Transport: "bg-chart-yellow/15 text-chart-yellow",
  Bills: "bg-chart-blue/15 text-chart-blue",
  Airtime: "bg-chart-red/15 text-chart-red",
  Savings: "bg-chart-purple/15 text-chart-purple",
  Other: "bg-muted/15 text-muted",
  Entertainment: "bg-chart-yellow/15 text-chart-yellow",
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { date: "2024-03-15", description: "MTN MoMo - Jumia Food", type: "sent", amount: 35000, category: "Food" },
  { date: "2024-03-15", description: "Salary Deposit", type: "received", amount: 2500000, category: "Other" },
  { date: "2024-03-14", description: "SafeBoda Ride", type: "sent", amount: 8000, category: "Transport" },
  { date: "2024-03-14", description: "UMEME Electricity", type: "sent", amount: 120000, category: "Bills" },
  { date: "2024-03-13", description: "Airtime Purchase", type: "sent", amount: 20000, category: "Airtime" },
  { date: "2024-03-13", description: "Freelance Payment", type: "received", amount: 450000, category: "Other" },
  { date: "2024-03-12", description: "Savings Transfer", type: "sent", amount: 150000, category: "Savings" },
  { date: "2024-03-12", description: "Rolex Stand", type: "sent", amount: 5000, category: "Food" },
  { date: "2024-03-11", description: "Bolt Ride to Kampala", type: "sent", amount: 25000, category: "Transport" },
  { date: "2024-03-11", description: "DSTV Subscription", type: "sent", amount: 89000, category: "Entertainment" },
  { date: "2024-03-10", description: "MTN Data Bundle", type: "sent", amount: 30000, category: "Airtime" },
  { date: "2024-03-10", description: "Family Support Received", type: "received", amount: 300000, category: "Other" },
];

interface TransactionTableProps {
  transactions?: Transaction[];
}

const TransactionTable = ({ transactions = MOCK_TRANSACTIONS }: TransactionTableProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(transactions.map((t) => t.category))], [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [transactions, search, categoryFilter]);

  const exportCSV = () => {
    const header = "Date,Description,Type,Amount (UGX),Category\n";
    const rows = filtered.map((t) => `${t.date},"${t.description}",${t.type},${t.amount},${t.category}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `momosense-statement-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="stat-card"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="font-heading font-semibold text-foreground">All Transactions</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-background border border-border rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" className="rounded-[10px] gap-2" onClick={exportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted">Date</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted">Description</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted">Type</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted">Amount</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-muted">Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-background" : ""}`}>
                <td className="py-3 px-2 font-mono text-xs">{t.date}</td>
                <td className="py-3 px-2">{t.description}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-medium ${t.type === "received" ? "text-chart-green" : "text-chart-red"}`}>
                    {t.type === "received" ? "Received" : "Sent"}
                  </span>
                </td>
                <td className={`py-3 px-2 text-right font-mono font-medium ${t.type === "received" ? "text-chart-green" : "text-chart-red"}`}>
                  {t.type === "received" ? "+" : "-"}UGX {t.amount.toLocaleString("en-UG")}
                </td>
                <td className="py-3 px-2">
                  <span className={`category-pill ${CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other}`}>
                    {t.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionTable;
