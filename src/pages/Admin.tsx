import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Check, ShieldCheck, ShieldX, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentRequest {
  id: string;
  email: string;
  network: string | null;
  momo_transaction_id: string;
  plan: string;
  amount_ugx: number;
  status: string | null;
  submitted_at: string | null;
  verified_at: string | null;
  user_id: string | null;
}

const PLAN_LIMITS: Record<string, number> = {
  starter: 150,
  pro: 300,
  business: 1000,
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthed(true);
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payment_requests")
      .select("*")
      .order("submitted_at", { ascending: false });
    setRequests((data as PaymentRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchRequests();
  }, [authed]);

  const handleActivate = async (req: PaymentRequest) => {
    const planKey = req.plan.toLowerCase();
    const limit = PLAN_LIMITS[planKey] ?? 150;

    // Update payment_requests status
    await supabase
      .from("payment_requests")
      .update({ status: "verified", verified_at: new Date().toISOString() })
      .eq("id", req.id);

    // Update profile plan
    await supabase
      .from("profiles")
      .update({ plan: planKey, pages_limit_month: limit })
      .eq("email", req.email);

    // Insert subscription
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await supabase.from("subscriptions").insert({
      user_id: req.user_id || req.email,
      plan: planKey,
      pages_limit: limit,
      amount_ugx: req.amount_ugx,
      expires_at: expiresAt.toISOString(),
      is_active: true,
      payment_method: req.network || "mobile_money",
      payment_reference: req.momo_transaction_id,
    });

    toast({ title: "Plan activated", description: `${req.email} is now on ${req.plan}` });
    fetchRequests();
  };

  const handleReject = async (req: PaymentRequest) => {
    await supabase
      .from("payment_requests")
      .update({ status: "rejected" })
      .eq("id", req.id);
    toast({ title: "Payment rejected" });
    fetchRequests();
  };

  const handleCopy = (txId: string) => {
    navigator.clipboard.writeText(txId);
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pending = requests.filter(r => r.status === "pending");
  const verifiedThisMonth = requests.filter(r => {
    if (r.status !== "verified" || !r.verified_at) return false;
    const d = new Date(r.verified_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const revenueThisMonth = verifiedThisMonth.reduce((sum, r) => sum + (r.amount_ugx || 0), 0);

  const statusColor = (status: string | null) => {
    if (status === "verified") return "bg-[hsl(150,65%,29%)]/15 text-[hsl(150,65%,29%)]";
    if (status === "rejected") return "bg-destructive/15 text-destructive";
    return "bg-[hsl(40,89%,61%)]/15 text-[hsl(40,89%,45%)]";
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-lg">
          <h1 className="font-heading font-bold text-xl text-foreground text-center">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2.5 rounded-[10px] text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading font-bold text-2xl text-foreground">Payment Requests</h1>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-foreground mt-1">{pending.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Verified this month</p>
            <p className="text-2xl font-bold text-foreground mt-1">{verifiedThisMonth.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenue this month</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              UGX {revenueThisMonth.toLocaleString("en-UG")}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Network</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      No payment requests yet.
                    </td>
                  </tr>
                )}
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-foreground">
                      {req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">{req.email}</td>
                    <td className="px-4 py-3 text-foreground">{req.network || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-foreground text-xs">{req.momo_transaction_id}</span>
                        <button
                          onClick={() => handleCopy(req.momo_transaction_id)}
                          className="p-0.5 rounded hover:bg-secondary transition-colors"
                        >
                          {copiedId === req.momo_transaction_id ? (
                            <Check className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground capitalize">{req.plan}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">
                      UGX {(req.amount_ugx || 0).toLocaleString("en-UG")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor(req.status)}`}>
                        {req.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleActivate(req)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Activate
                          </button>
                          <button
                            onClick={() => handleReject(req)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          >
                            <ShieldX className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
