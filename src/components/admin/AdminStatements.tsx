import { useEffect, useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllStatements, type AdminStatement } from "@/lib/admin-helpers";
import { supabase } from "@/integrations/supabase/client";

const PROVIDERS = ["All", "MTN MoMo", "Airtel Money"];

const AdminStatements = () => {
  const [statements, setStatements] = useState<(AdminStatement & { user_email?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    const stmts = await fetchAllStatements();
    // Fetch user emails for each unique user_id
    const userIds = [...new Set(stmts.map((s) => s.user_id).filter(Boolean))];
    let emailMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email")
        .in("user_id", userIds as string[]);
      (profiles || []).forEach((p) => { emailMap[p.user_id] = p.email || ""; });
    }
    setStatements(stmts.map((s) => ({ ...s, user_email: emailMap[s.user_id || ""] || "N/A" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = statements;
    if (providerFilter !== "All") list = list.filter((s) => (s.provider || "").toLowerCase().includes(providerFilter.toLowerCase()));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => (s.user_email || "").toLowerCase().includes(q) || (s.provider || "").toLowerCase().includes(q));
    }
    return list;
  }, [statements, providerFilter, search]);

  const exportCSV = () => {
    const header = "Date,User Email,Provider,Date Range,Pages,Transactions,Money In,Money Out,Net Balance\n";
    const rows = filtered.map((s) =>
      `${s.uploaded_at || ""},${s.user_email},${s.provider || ""},${s.date_from || ""} - ${s.date_to || ""},${s.total_pages || 0},${s.total_transactions || 0},${s.total_in || 0},${s.total_out || 0},${s.net_balance || 0}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "statements.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {PROVIDERS.map((p) => (
            <button key={p} onClick={() => setProviderFilter(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${providerFilter === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search email or provider..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-56" />
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date Range</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pages</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">TXs</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Money In</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Money Out</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">{Array.from({ length: 9 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">No statements found.</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{s.uploaded_at ? new Date(s.uploaded_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-foreground">{s.user_email}</td>
                  <td className="px-4 py-3 text-foreground">{s.provider || "—"}</td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">{s.date_from || "—"} — {s.date_to || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{s.total_pages || 0}</td>
                  <td className="px-4 py-3 text-foreground">{s.total_transactions || 0}</td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">UGX {(s.total_in || 0).toLocaleString("en-UG")}</td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">UGX {(s.total_out || 0).toLocaleString("en-UG")}</td>
                  <td className={`px-4 py-3 font-semibold whitespace-nowrap ${(s.net_balance || 0) >= 0 ? "text-[hsl(150,65%,29%)]" : "text-destructive"}`}>
                    UGX {(s.net_balance || 0).toLocaleString("en-UG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStatements;
