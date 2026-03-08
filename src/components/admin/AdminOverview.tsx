import { useEffect, useState } from "react";
import { Users, CreditCard, FileText, DollarSign, BarChart3, Activity } from "lucide-react";
import { fetchOverviewStats, fetchRevenueChart, fetchSignupChart } from "@/lib/admin-helpers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const AdminOverview = () => {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchOverviewStats>> | null>(null);
  const [revenue, setRevenue] = useState<{ month: string; revenue: number }[]>([]);
  const [signups, setSignups] = useState<{ date: string; signups: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [s, r, u] = await Promise.all([fetchOverviewStats(), fetchRevenueChart(), fetchSignupChart()]);
    setStats(s);
    setRevenue(r);
    setSignups(u);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const STAT_CARDS = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-[hsl(var(--chart-1))]" },
    { label: "Active Subscribers", value: stats?.activeSubscribers, icon: CreditCard, color: "text-[hsl(var(--chart-3))]" },
    { label: "Pending Payments", value: stats?.pendingPayments, icon: Activity, color: "text-[hsl(var(--chart-2))]" },
    { label: "Revenue This Month", value: stats ? `UGX ${stats.revenueThisMonth.toLocaleString("en-UG")}` : null, icon: DollarSign, color: "text-[hsl(var(--chart-1))]" },
    { label: "Statements Uploaded", value: stats?.totalStatements, icon: FileText, color: "text-[hsl(var(--chart-5))]" },
    { label: "Transactions Parsed", value: stats?.totalTransactions, icon: BarChart3, color: "text-[hsl(var(--chart-4))]" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</p>
            </div>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{card.value ?? 0}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Revenue (Last 6 Months)</h3>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`UGX ${v.toLocaleString("en-UG")}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">User Signups (Last 30 Days)</h3>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={signups}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={4} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="signups" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
