import { useEffect, useState, useMemo } from "react";
import { Search, Check, X as XIcon, Eye, Download, Copy, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { fetchAllPaymentRequests, activatePayment, rejectPayment, type AdminPaymentRequest } from "@/lib/admin-helpers";

const TABS = ["All", "Pending", "Verified", "Rejected"] as const;

interface AdminPaymentsProps {
  refreshKey?: number;
  onRefresh?: () => void;
}

const AdminPayments = ({ refreshKey, onRefresh }: AdminPaymentsProps) => {
  const [requests, setRequests] = useState<AdminPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailReq, setDetailReq] = useState<AdminPaymentRequest | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchAllPaymentRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [refreshKey]);

  const filtered = useMemo(() => {
    let list = requests;
    if (tab !== "All") list = list.filter((r) => (r.status || "pending").toLowerCase() === tab.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.email.toLowerCase().includes(q) || r.momo_transaction_id.toLowerCase().includes(q));
    }
    return list;
  }, [requests, tab, search]);

  const handleActivate = async (req: AdminPaymentRequest) => {
    await activatePayment(req);
    toast.success(`Activated ${req.email} → ${req.plan}`);
    load();
    onRefresh?.();
  };

  const handleReject = async (id: string) => {
    await rejectPayment(id);
    toast.success("Payment rejected");
    load();
    onRefresh?.();
  };

  const handleBulkActivate = async () => {
    const pending = filtered.filter((r) => selected.has(r.id) && r.status === "pending");
    for (const r of pending) await activatePayment(r);
    toast.success(`Activated ${pending.length} payments`);
    setSelected(new Set());
    load();
    onRefresh?.();
  };

  const handleBulkReject = async () => {
    const pending = filtered.filter((r) => selected.has(r.id) && r.status === "pending");
    for (const r of pending) await rejectPayment(r.id);
    toast.success(`Rejected ${pending.length} payments`);
    setSelected(new Set());
    load();
    onRefresh?.();
  };

  const exportCSV = () => {
    const header = "Date,Email,Network,Transaction ID,Plan,Amount,Status\n";
    const rows = filtered.map((r) =>
      `${r.submitted_at || ""},${r.email},${r.network || ""},${r.momo_transaction_id},${r.plan},${r.amount_ugx},${r.status || "pending"}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "payment_requests.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = (status: string | null) => {
    if (status === "verified") return "bg-[hsl(150,65%,29%)]/15 text-[hsl(150,65%,29%)]";
    if (status === "rejected") return "bg-destructive/15 text-destructive";
    return "bg-[hsl(40,89%,61%)]/15 text-[hsl(40,89%,45%)]";
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search email or TX ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-foreground">{selected.size} selected</span>
          <Button size="sm" className="h-7 text-xs" onClick={handleBulkActivate}>✅ Bulk Activate</Button>
          <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleBulkReject}>❌ Bulk Reject</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-3 py-3 w-10"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={(c) => setSelected(c ? new Set(filtered.map(r => r.id)) : new Set())} /></th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Network</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">TX ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">No payment requests found.</td></tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-3 py-3"><Checkbox checked={selected.has(req.id)} onCheckedChange={() => toggleSelect(req.id)} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-foreground">{req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-foreground">{req.email}</td>
                    <td className="px-4 py-3 text-foreground">{req.network || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">{req.momo_transaction_id}</td>
                    <td className="px-4 py-3 text-foreground capitalize">{req.plan}</td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">UGX {(req.amount_ugx || 0).toLocaleString("en-UG")}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor(req.status)}`}>
                        {req.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDetailReq(req)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {req.status === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-[hsl(150,65%,29%)]" onClick={() => handleActivate(req)}>
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => handleReject(req.id)}>
                              <ShieldX className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailReq} onOpenChange={() => setDetailReq(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {detailReq && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium text-foreground">{detailReq.email}</p></div>
                <div><p className="text-muted-foreground text-xs">Plan</p><p className="font-medium text-foreground capitalize">{detailReq.plan}</p></div>
                <div><p className="text-muted-foreground text-xs">Network</p><p className="font-medium text-foreground">{detailReq.network || "N/A"}</p></div>
                <div><p className="text-muted-foreground text-xs">Amount</p><p className="font-medium text-foreground">UGX {(detailReq.amount_ugx || 0).toLocaleString("en-UG")}</p></div>
                <div><p className="text-muted-foreground text-xs">TX ID</p><p className="font-mono text-xs text-foreground">{detailReq.momo_transaction_id}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p><p className="font-medium capitalize text-foreground">{detailReq.status || "pending"}</p></div>
                <div><p className="text-muted-foreground text-xs">Submitted</p><p className="font-medium text-foreground">{detailReq.submitted_at ? new Date(detailReq.submitted_at).toLocaleString() : "—"}</p></div>
                <div><p className="text-muted-foreground text-xs">User ID</p><p className="font-mono text-xs text-foreground truncate">{detailReq.user_id || "N/A"}</p></div>
              </div>
              {detailReq.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => { handleActivate(detailReq); setDetailReq(null); }}>✅ Activate</Button>
                  <Button variant="destructive" className="flex-1" onClick={() => { handleReject(detailReq.id); setDetailReq(null); }}>❌ Reject</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
