import { supabase } from "@/integrations/supabase/client";
import type { ParsedStatement, ParsedTransaction } from "@/lib/pdfParser";

// ============ PROFILE HELPERS ============

export async function getOrCreateProfile(userId: string, userInfo?: { email?: string; fullName?: string }) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const today = new Date().toISOString().split("T")[0];
    const lastReset = existing.last_reset_date;
    const updates: Record<string, unknown> = {};

    if (lastReset !== today) {
      updates.pages_used_today = 0;
      updates.last_reset_date = today;
    }

    const now = new Date();
    if (lastReset) {
      const lastResetDate = new Date(lastReset);
      if (now.getMonth() !== lastResetDate.getMonth() || now.getFullYear() !== lastResetDate.getFullYear()) {
        updates.pages_used_month = 0;
      }
    }

    // Backfill email/name if missing
    if (userInfo?.email && !existing.email) updates.email = userInfo.email;
    if (userInfo?.fullName && !existing.full_name) updates.full_name = userInfo.fullName;

    if (Object.keys(updates).length > 0) {
      const { data: updated } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", userId)
        .select()
        .single();
      return updated || existing;
    }

    return existing;
  }

  const { data: newProfile } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      email: userInfo?.email || null,
      full_name: userInfo?.fullName || null,
    })
    .select()
    .single();

  return newProfile;
}

export async function checkPageLimit(userId: string, numPages: number): Promise<{ allowed: boolean; used: number; limit: number }> {
  const profile = await getOrCreateProfile(userId);
  if (!profile) return { allowed: true, used: 0, limit: 5 };

  const used = profile.pages_used_month || 0;
  const limit = profile.pages_limit_month || 5;
  return { allowed: used + numPages <= limit, used, limit };
}

export async function incrementPageCount(userId: string, numPages: number) {
  const profile = await getOrCreateProfile(userId);
  if (!profile) return;

  await supabase
    .from("profiles")
    .update({
      pages_used_today: (profile.pages_used_today || 0) + numPages,
      pages_used_month: (profile.pages_used_month || 0) + numPages,
      last_reset_date: new Date().toISOString().split("T")[0],
    })
    .eq("user_id", userId);
}

// ============ SAVE STATEMENT FLOW ============

function parseDateForDB(dateStr: string): string | null {
  if (!dateStr) return null;
  // Dates are now YYYY-MM-DD from the parser, pass through directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Legacy DD-MM-YYYY fallback
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

export async function saveStatementToSupabase(
  userId: string,
  parsed: ParsedStatement,
  numPages: number,
  insightTexts: string[]
): Promise<string | null> {
  // 1. Save statement summary
  const { data: stmt, error: stmtErr } = await supabase
    .from("statements")
    .insert({
      user_id: userId,
      provider: parsed.provider,
      account_name: parsed.accountHolder,
      date_from: parseDateForDB(parsed.dateRange.from),
      date_to: parseDateForDB(parsed.dateRange.to),
      total_pages: numPages,
      total_in: Math.round(parsed.totalIn),
      total_out: Math.round(parsed.totalOut),
      net_balance: Math.round(parsed.netBalance),
      total_fees: Math.round(parsed.totalFees),
      total_taxes: Math.round(parsed.totalTaxes),
      total_transactions: parsed.transactions.length,
    })
    .select("id")
    .single();

  if (stmtErr || !stmt) {
    console.error("Error saving statement:", stmtErr);
    return null;
  }

  const statementId = stmt.id;

  // 2. Batch insert transactions (chunks of 500)
  const txRows = parsed.transactions.map((t: ParsedTransaction) => ({
    statement_id: statementId,
    user_id: userId,
    date: parseDateForDB(t.date),
    time: t.time,
    description: t.description,
    transaction_type: t.transactionType,
    transaction_id_ref: t.transactionId,
    direction: t.type === "received" ? "in" : "out",
    amount: Math.round(t.amount),
    fees: Math.round(t.fees),
    taxes: Math.round(t.taxes),
    running_balance: Math.round(t.balance),
    category: t.category,
  }));

  for (let i = 0; i < txRows.length; i += 500) {
    const chunk = txRows.slice(i, i + 500);
    const { error: txErr } = await supabase.from("transactions").insert(chunk);
    if (txErr) console.error("Error saving transactions batch:", txErr);
  }

  // 3. Save insights
  if (insightTexts.length > 0) {
    const insightRows = insightTexts.map((text) => ({
      statement_id: statementId,
      user_id: userId,
      insight_text: text,
    }));
    const { error: insErr } = await supabase.from("insights").insert(insightRows);
    if (insErr) console.error("Error saving insights:", insErr);
  }

  // 4. Increment page count
  await incrementPageCount(userId, numPages);

  return statementId;
}

// ============ FETCH STATEMENT HISTORY ============

export interface StatementSummary {
  id: string;
  provider: string | null;
  account_name: string | null;
  date_from: string | null;
  date_to: string | null;
  total_transactions: number | null;
  net_balance: number | null;
  total_in: number | null;
  total_out: number | null;
  uploaded_at: string | null;
}

export async function fetchRecentStatements(userId: string, limit = 5): Promise<StatementSummary[]> {
  const { data, error } = await supabase
    .from("statements")
    .select("id, provider, account_name, date_from, date_to, total_transactions, net_balance, total_in, total_out, uploaded_at")
    .eq("user_id", userId)
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching statements:", error);
    return [];
  }
  return (data || []) as StatementSummary[];
}

export interface StoredTransaction {
  date: string | null;
  time: string | null;
  description: string | null;
  transaction_type: string | null;
  transaction_id_ref: string | null;
  direction: string | null;
  amount: number | null;
  fees: number | null;
  taxes: number | null;
  running_balance: number | null;
  category: string | null;
}

export async function fetchStatementTransactions(statementId: string): Promise<ParsedTransaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("statement_id", statementId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return (data || []).map((t: StoredTransaction) => {
    // Dates are stored as YYYY-MM-DD in DB, keep as-is
    return {
      date: t.date || "",
      time: t.time || "",
      transactionType: t.transaction_type || "",
      description: t.description || "",
      transactionId: t.transaction_id_ref || "",
      from: "",
      to: "",
      accountName: "",
      reference: "",
      amount: t.amount || 0,
      fees: t.fees || 0,
      taxes: t.taxes || 0,
      balance: t.running_balance || 0,
      type: t.direction === "in" ? "received" as const : "sent" as const,
      category: t.category || "Other",
    };
  });
}

export async function fetchStatementInsights(statementId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("insights")
    .select("insight_text")
    .eq("statement_id", statementId);

  if (error) {
    console.error("Error fetching insights:", error);
    return [];
  }
  return (data || []).map((r: { insight_text: string | null }) => r.insight_text || "");
}

export async function fetchFullStatement(statementId: string): Promise<ParsedStatement | null> {
  const { data: stmt, error } = await supabase
    .from("statements")
    .select("*")
    .eq("id", statementId)
    .single();

  if (error || !stmt) return null;

  const transactions = await fetchStatementTransactions(statementId);

  const incomingCount = transactions.filter(t => t.type === "received").length;
  const outgoingCount = transactions.filter(t => t.type === "sent").length;

  // Dates are YYYY-MM-DD in DB, keep as-is
  const dateFrom = stmt.date_from || "";
  const dateTo = stmt.date_to || "";

  return {
    transactions,
    totalIn: Number(stmt.total_in) || 0,
    totalOut: Number(stmt.total_out) || 0,
    totalFees: Number(stmt.total_fees) || 0,
    totalTaxes: Number(stmt.total_taxes) || 0,
    netBalance: Number(stmt.net_balance) || 0,
    incomingCount,
    outgoingCount,
    accountHolder: stmt.account_name || "",
    phoneNumber: "",
    emailAddress: "",
    provider: stmt.provider || "",
    statementPeriod: dateFrom && dateTo ? `${dateFrom} to ${dateTo}` : "",
    dateRange: { from: dateFrom, to: dateTo },
  };
}
