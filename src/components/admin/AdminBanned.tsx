import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchAllUsers, unbanUser, type AdminUser } from "@/lib/admin-helpers";

const AdminBanned = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await fetchAllUsers();
    setUsers(all.filter((u) => u.is_banned));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUnban = async (user: AdminUser) => {
    await unbanUser(user.user_id);
    toast.success(`Unbanned ${user.email}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ban Reason</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Banned Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-border">{Array.from({ length: 5 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
              )) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No banned users.</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{user.full_name || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{user.email || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{user.ban_reason || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{user.banned_at ? new Date(user.banned_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={() => handleUnban(user)}>
                      <ShieldCheck className="w-3.5 h-3.5" /> Unban
                    </Button>
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

export default AdminBanned;
