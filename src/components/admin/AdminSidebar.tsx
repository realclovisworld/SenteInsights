import { useState } from "react";
import { BarChart3, CreditCard, Users, FileText, ShieldBan, Settings, Bell, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminPage = "overview" | "payments" | "users" | "statements" | "banned" | "settings";

const NAV_ITEMS: { id: AdminPage; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "payments", label: "Payment Requests", icon: CreditCard },
  { id: "users", label: "Users", icon: Users },
  { id: "statements", label: "Statements", icon: FileText },
  { id: "banned", label: "Banned Users", icon: ShieldBan },
  { id: "settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  pendingCount: number;
  onLogout: () => void;
}

const AdminSidebar = ({ activePage, onNavigate, pendingCount, onLogout }: AdminSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full w-64 bg-[#1B3A6B] text-white">
      <div className="p-5 border-b border-white/10">
        <h2 className="font-heading font-bold text-lg tracking-tight">MoMoSense Admin</h2>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white border-l-[3px] border-[#1A7A4A]"
                  : "text-white/70 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent"
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === "payments" && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0">
        {sidebar}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1B3A6B] text-white rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
          <div className="md:hidden fixed left-0 top-0 bottom-0 z-50">
            {sidebar}
          </div>
        </>
      )}
    </>
  );
};

export default AdminSidebar;
