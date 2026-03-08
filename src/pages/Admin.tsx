import { useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
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

const ADMIN_EMAILS = ["paintingislife592@gmail.com"];

/** Check if the current Clerk user has admin role via publicMetadata or is in the admin emails list */
function useIsAdmin() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  const isLoaded = userLoaded && authLoaded;
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = isSignedIn && (
    user?.publicMetadata?.role === "admin" ||
    (!!email && ADMIN_EMAILS.includes(email))
  );

  return { isLoaded, isSignedIn, isAdmin };
}

const Admin = () => {
  const { isLoaded, isSignedIn, isAdmin } = useIsAdmin();
  const [page, setPage] = useState<AdminPage>("overview");
  const [pendingPayments, setPendingPayments] = useState<AdminPaymentRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadPending = useCallback(async () => {
    const all = await fetchAllPaymentRequests();
    setPendingPayments(all.filter((r) => r.status === "pending"));
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadPending();
      const interval = setInterval(loadPending, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, loadPending]);

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

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Signed in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-lg text-center">
          <h1 className="font-heading font-bold text-xl text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You don't have admin privileges. Contact the administrator to request access.
          </p>
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
        onLogout={() => window.location.href = "/"}
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
          {page === "settings" && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
