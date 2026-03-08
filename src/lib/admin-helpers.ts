import { supabase } from "@/integrations/supabase/client";

// ============ OVERVIEW STATS ============

export async function fetchOverviewStats() {
  const [
    { count: totalUsers },
    { count: activeSubscribers },
    { count: pendingPayments },
    { count: totalStatements },
    { count: totalTransactions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).neq("plan", "free"),
    supabase.from("payment_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("statements").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
  ]);

  // Revenue this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { data: verifiedThisMonth } = await supabase
    .from("payment_requests")
    .select("amount_ugx")
    .eq("status", "verified")
    .gte("verified_at", monthStart);

  const revenueThisMonth = (verifiedThisMonth || []).reduce((s, r) => s + (r.amount_ugx || 0), 0);

  return {
    totalUsers: totalUsers || 0,
    activeSubscribers: activeSubscribers || 0,
    pendingPayments: pendingPayments || 0,
    revenueThisMonth,
    totalStatements: totalStatements || 0,
    totalTransactions: totalTransactions || 0,
  };
}

// ============ REVENUE CHART DATA (last 6 months) ============

export async function fetchRevenueChart() {
  const months: { label: string; start: string; end: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    months.push({
      label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      start: d.toISOString(),
      end: end.toISOString(),
    });
  }

  const { data } = await supabase
    .from("payment_requests")
    .select("amount_ugx, verified_at")
    .eq("status", "verified")
    .gte("verified_at", months[0].start);

  return months.map((m) => {
    const total = (data || [])
      .filter((r) => r.verified_at && r.verified_at >= m.start && r.verified_at <= m.end)
      .reduce((s, r) => s + (r.amount_ugx || 0), 0);
    return { month: m.label, revenue: total };
  });
}

// ============ SIGNUPS CHART (last 30 days) ============

export async function fetchSignupChart() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  const dayCounts: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    dayCounts[d.toISOString().split("T")[0]] = 0;
  }

  (data || []).forEach((p) => {
    if (p.created_at) {
      const day = p.created_at.split("T")[0];
      if (dayCounts[day] !== undefined) dayCounts[day]++;
    }
  });

  return Object.entries(dayCounts).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    signups: count,
  }));
}

// ============ PAYMENT REQUESTS ============

export interface AdminPaymentRequest {
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

export async function fetchAllPaymentRequests(): Promise<AdminPaymentRequest[]> {
  const { data } = await supabase
    .from("payment_requests")
    .select("*")
    .order("submitted_at", { ascending: false });
  return (data as AdminPaymentRequest[]) || [];
}

export async function activatePayment(req: AdminPaymentRequest) {
  const PLAN_LIMITS: Record<string, number> = { starter: 150, pro: 300, business: 1000 };
  const planKey = req.plan.toLowerCase();
  const limit = PLAN_LIMITS[planKey] ?? 150;

  await supabase
    .from("payment_requests")
    .update({ status: "verified", verified_at: new Date().toISOString() })
    .eq("id", req.id);

  await supabase
    .from("profiles")
    .update({ plan: planKey, pages_limit_month: limit })
    .eq("email", req.email);

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
}

export async function rejectPayment(id: string) {
  await supabase
    .from("payment_requests")
    .update({ status: "rejected" })
    .eq("id", id);
}

// ============ USERS ============

export interface AdminUser {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  plan: string | null;
  pages_used_month: number | null;
  pages_limit_month: number | null;
  pages_used_today: number | null;
  created_at: string | null;
  is_banned: boolean | null;
  ban_reason: string | null;
  banned_at: string | null;
}

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as unknown as AdminUser[]) || [];
}

export async function updateUserPlan(userId: string, plan: string, pagesLimit: number) {
  await supabase
    .from("profiles")
    .update({ plan, pages_limit_month: pagesLimit })
    .eq("user_id", userId);
}

export async function resetUserPages(userId: string) {
  await supabase
    .from("profiles")
    .update({ pages_used_month: 0, pages_used_today: 0 })
    .eq("user_id", userId);
}

export async function banUser(userId: string, reason: string) {
  await supabase
    .from("profiles")
    .update({
      is_banned: true,
      ban_reason: reason,
      banned_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .eq("user_id", userId);

  // Cancel active subscriptions
  await supabase
    .from("subscriptions")
    .update({ is_active: false } as Record<string, unknown>)
    .eq("user_id", userId)
    .eq("is_active", true);
}

export async function unbanUser(userId: string) {
  await supabase
    .from("profiles")
    .update({
      is_banned: false,
      ban_reason: null,
      banned_at: null,
    } as Record<string, unknown>)
    .eq("user_id", userId);
}

export async function deleteUser(userId: string) {
  // Delete transactions, statements, insights, subscriptions, payment_requests, then profile
  // Due to RLS we delete what we can
  const { data: stmts } = await supabase.from("statements").select("id").eq("user_id", userId);
  if (stmts) {
    for (const s of stmts) {
      await supabase.from("transactions").delete().eq("statement_id", s.id);
      await supabase.from("insights").delete().eq("statement_id", s.id);
    }
    await supabase.from("statements").delete().eq("user_id", userId);
  }
  await supabase.from("subscriptions").delete().eq("user_id", userId);
  await supabase.from("payment_requests").delete().eq("user_id", userId);
  await supabase.from("profiles").delete().eq("user_id", userId);
}

// ============ STATEMENTS ============

export interface AdminStatement {
  id: string;
  user_id: string | null;
  provider: string | null;
  account_name: string | null;
  date_from: string | null;
  date_to: string | null;
  total_pages: number | null;
  total_transactions: number | null;
  total_in: number | null;
  total_out: number | null;
  net_balance: number | null;
  uploaded_at: string | null;
}

export async function fetchAllStatements(): Promise<AdminStatement[]> {
  const { data } = await supabase
    .from("statements")
    .select("*")
    .order("uploaded_at", { ascending: false });
  return (data as unknown as AdminStatement[]) || [];
}

// ============ SETTINGS ============

export async function fetchAdminSettings(): Promise<Record<string, string>> {
  const { data } = await (supabase as any).from("admin_settings").select("*");
  const settings: Record<string, string> = {};
  (data || []).forEach((row: { key: string; value: string | null }) => {
    settings[row.key] = row.value || "";
  });
  return settings;
}

export async function updateAdminSetting(key: string, value: string) {
  await (supabase as any)
    .from("admin_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key);
}
