import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminSidebar, { type AdminPage } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminStatements from "@/components/admin/AdminStatements";
import AdminBanned from "@/components/admin/AdminBanned";
import AdminSettings from "@/components/admin/AdminSettings";
import { fetchAllPaymentRequests, activatePayment, rejectPayment, type AdminPaymentRequest } from "@/lib/admin-helpers";

const PAGE_TITLES: Record<AdminPage, string> = {
  overview: "Overview",
  payments: "Payment Requests",
  users: "Users",
  statements: "Statements",
  banned: "Banned Users",
  settings: "Settings",
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [page, setPage] = useState<AdminPage>("overview");
  const [pendingPayments, setPendingPayments] = useState<AdminPaymentRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleLogin = () => {
    if (password === adminPassword) {
      setAuthed(true);
    } else {
      toast.error("Wrong password");
    }
  };

  const loadPending = useCallback(async () => {
    const all = await fetchAllPaymentRequests();
    setPendingPayments(all.filter((r) => r.status === "pending"));
  }, []);

  useEffect(() => {
    if (authed) {
      loadPending();
      const interval = setInterval(loadPending, 30000);
      return () => clearInterval(interval);
    }
  }, [authed, loadPending]);

  const handleHeaderActivate = async (req: AdminPaymentRequest) => {
    await activatePayment(req);
    toast.success(`Activated ${req.email}`);
    loadPending();
    setRefreshKey((k) => k + 1);
  };

  const handleHeaderReject = async (id: string) => {
    await rejectPayment(id);
    toast.success("Payment rejected");
    loadPending();
    setRefreshKey((k) => k + 1);
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
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activePage={page}
        onNavigate={setPage}
        pendingCount={pendingPayments.length}
        onLogout={() => setAuthed(false)}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <AdminHeader
          title={PAGE_TITLES[page]}
          pendingPayments={pendingPayments}
          onGoToPayment={() => setPage("payments")}
          onActivate={handleHeaderActivate}
          onReject={handleHeaderReject}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {page === "overview" && <AdminOverview />}
          {page === "payments" && <AdminPayments refreshKey={refreshKey} onRefresh={() => { loadPending(); setRefreshKey((k) => k + 1); }} />}
          {page === "users" && <AdminUsers />}
          {page === "statements" && <AdminStatements />}
          {page === "banned" && <AdminBanned />}
          {page === "settings" && <AdminSettings adminPassword={adminPassword} />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
