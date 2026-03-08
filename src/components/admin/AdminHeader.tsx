import { Bell } from "lucide-react";
import { useState } from "react";
import type { AdminPaymentRequest } from "@/lib/admin-helpers";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  pendingPayments: AdminPaymentRequest[];
  onGoToPayment: (id: string) => void;
  onActivate: (req: AdminPaymentRequest) => void;
  onReject: (id: string) => void;
}

const AdminHeader = ({ title, pendingPayments, onGoToPayment, onActivate, onReject }: AdminHeaderProps) => {
  const [bellOpen, setBellOpen] = useState(false);
  const pending = pendingPayments.slice(0, 5);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <h1 className="font-heading font-bold text-xl text-foreground md:ml-0 ml-12">{title}</h1>
      <div className="relative">
        <button
          onClick={() => setBellOpen(!bellOpen)}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Bell className="w-5 h-5 text-foreground" />
          {pendingPayments.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
              {pendingPayments.length > 9 ? "9+" : pendingPayments.length}
            </span>
          )}
        </button>

        {bellOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
            <div className="absolute right-0 top-12 z-50 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Pending Payments</p>
              </div>
              {pending.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">No pending payments</div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                  {pending.map((req) => (
                    <div key={req.id} className="px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{req.email}</p>
                        <span className="text-xs text-muted-foreground">
                          UGX {(req.amount_ugx || 0).toLocaleString("en-UG")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{req.plan} · {req.network || "N/A"}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 text-xs" onClick={() => { onActivate(req); setBellOpen(false); }}>
                          ✅ Activate
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => { onReject(req.id); setBellOpen(false); }}>
                          ❌ Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
