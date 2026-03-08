import { useEffect, useState, useMemo } from "react";
import { Search, Eye, Pencil, RefreshCw, ShieldBan, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { fetchAllUsers, updateUserPlan, resetUserPages, banUser, deleteUser, type AdminUser } from "@/lib/admin-helpers";

const PLAN_LIMITS: Record<string, number> = { free: 5, starter: 150, pro: 300, business: 1000, enterprise: 99999 };
const PLAN_FILTERS = ["All", "Free", "Starter", "Pro", "Business"];
const BAN_REASONS = ["Fraudulent payment", "Abuse of free tier", "Suspicious activity", "Terms of service violation", "Other"];

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "active" | "plan">("newest");
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [banModal, setBanModal] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState(BAN_REASONS[0]);
  const [banNotes, setBanNotes] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);

  const load = async () => {
    setLoading(true);
    setUsers(await fetchAllUsers());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = users.filter((u) => !(u.is_banned));
    if (planFilter !== "All") list = list.filter((u) => (u.plan || "free").toLowerCase() === planFilter.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => (u.full_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    if (sortBy === "active") list.sort((a, b) => (b.pages_used_month || 0) - (a.pages_used_month || 0));
    if (sortBy === "plan") {
      const order = ["enterprise", "business", "pro", "starter", "free"];
      list.sort((a, b) => order.indexOf(a.plan || "free") - order.indexOf(b.plan || "free"));
    }
    return list;
  }, [users, planFilter, search, sortBy]);

  const statusPill = (user: AdminUser) => {
    if (user.is_banned) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/15 text-destructive">Banned</span>;
    if ((user.plan || "free") !== "free") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[hsl(150,65%,29%)]/15 text-[hsl(150,65%,29%)]">Active</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-secondary text-muted-foreground">Free</span>;
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    const limit = PLAN_LIMITS[editPlan] || 5;
    await updateUserPlan(editUser.user_id, editPlan, limit);
    toast.success(`Updated ${editUser.email} to ${editPlan}`);
    setEditUser(null);
    load();
  };

  const handleReset = async (user: AdminUser) => {
    await resetUserPages(user.user_id);
    toast.success(`Reset pages for ${user.email}`);
    load();
  };

  const handleBan = async () => {
    if (!banModal) return;
    const reason = banNotes ? `${banReason}: ${banNotes}` : banReason;
    await banUser(banModal.user_id, reason);
    toast.success(`Banned ${banModal.email}`);
    setBanModal(null);
    setBanNotes("");
    load();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteUser(deleteConfirm.user_id);
    toast.success(`Deleted ${deleteConfirm.email}`);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {PLAN_FILTERS.map((f) => (
            <button key={f} onClick={() => setPlanFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${planFilter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 w-56" />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="active">Most Active</SelectItem>
              <SelectItem value="plan">Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pages Used</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">{Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>)}</tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No users found.</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{user.full_name || "—"}</td>
                  <td className="px-4 py-3 text-foreground">{user.email || "—"}</td>
                  <td className="px-4 py-3 capitalize text-foreground">{user.plan || "free"}</td>
                  <td className="px-4 py-3 text-foreground">{user.pages_used_month || 0} / {user.pages_limit_month || 5}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-foreground">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3">{statusPill(user)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setViewUser(user)} title="View"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setEditUser(user); setEditPlan(user.plan || "free"); }} title="Edit Plan"><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleReset(user)} title="Reset Pages"><RefreshCw className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setBanModal(user)} title="Ban"><ShieldBan className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => setDeleteConfirm(user)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium text-foreground">{viewUser.full_name || "—"}</p></div>
                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium text-foreground">{viewUser.email || "—"}</p></div>
                <div><p className="text-muted-foreground text-xs">Plan</p><p className="font-medium capitalize text-foreground">{viewUser.plan || "free"}</p></div>
                <div><p className="text-muted-foreground text-xs">Pages (month)</p><p className="font-medium text-foreground">{viewUser.pages_used_month || 0} / {viewUser.pages_limit_month || 5}</p></div>
                <div><p className="text-muted-foreground text-xs">Pages (today)</p><p className="font-medium text-foreground">{viewUser.pages_used_today || 0}</p></div>
                <div><p className="text-muted-foreground text-xs">Joined</p><p className="font-medium text-foreground">{viewUser.created_at ? new Date(viewUser.created_at).toLocaleDateString() : "—"}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground text-xs">User ID</p><p className="font-mono text-xs text-foreground break-all">{viewUser.user_id}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit Plan — {editUser?.email}</DialogTitle></DialogHeader>
          <Select value={editPlan} onValueChange={setEditPlan}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(PLAN_LIMITS).map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Pages limit: {PLAN_LIMITS[editPlan] || 5}</p>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogContent>
      </Dialog>

      {/* Ban Modal */}
      <Dialog open={!!banModal} onOpenChange={() => setBanModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Ban User</DialogTitle></DialogHeader>
          {banModal && (
            <div className="space-y-3">
              <p className="text-sm text-foreground">{banModal.full_name || banModal.email}</p>
              <Select value={banReason} onValueChange={setBanReason}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BAN_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea placeholder="Additional notes (optional)" value={banNotes} onChange={(e) => setBanNotes(e.target.value)} />
              <Button variant="destructive" className="w-full" onClick={handleBan}>Confirm Ban</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteConfirm?.email}'s profile and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
