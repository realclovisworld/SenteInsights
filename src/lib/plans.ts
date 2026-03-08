export type PlanId = "anonymous" | "free" | "starter" | "pro" | "business" | "enterprise";

export interface PlanConfig {
  name: string;
  pagesPerDay: number | null;
  pagesPerMonth: number | null;
  aiInsights: boolean;
  csvExport: boolean;
  excelExport: boolean;
  watermark: boolean;
  statementHistory: boolean;
  batchUpload: boolean;
  pdfReport: boolean;
  price: number | null; // UGX per month, null = free or contact
}

export const PLANS: Record<PlanId, PlanConfig> = {
  anonymous: {
    name: "Anonymous",
    pagesPerDay: 1,
    pagesPerMonth: null,
    aiInsights: false,
    csvExport: false,
    excelExport: false,
    watermark: true,
    statementHistory: false,
    batchUpload: false,
    pdfReport: false,
    price: null,
  },
  free: {
    name: "Registered",
    pagesPerDay: 5,
    pagesPerMonth: null,
    aiInsights: true,
    csvExport: true,
    excelExport: false,
    watermark: false,
    statementHistory: false,
    batchUpload: false,
    pdfReport: false,
    price: 0,
  },
  starter: {
    name: "Starter",
    pagesPerDay: null,
    pagesPerMonth: 150,
    aiInsights: true,
    csvExport: true,
    excelExport: true,
    watermark: false,
    statementHistory: true,
    batchUpload: false,
    pdfReport: false,
    price: 15000,
  },
  pro: {
    name: "Pro",
    pagesPerDay: null,
    pagesPerMonth: 300,
    aiInsights: true,
    csvExport: true,
    excelExport: true,
    watermark: false,
    statementHistory: true,
    batchUpload: true,
    pdfReport: true,
    price: 30000,
  },
  business: {
    name: "Business",
    pagesPerDay: null,
    pagesPerMonth: 1000,
    aiInsights: true,
    csvExport: true,
    excelExport: true,
    watermark: false,
    statementHistory: true,
    batchUpload: true,
    pdfReport: true,
    price: 50000,
  },
  enterprise: {
    name: "Enterprise",
    pagesPerDay: null,
    pagesPerMonth: null,
    aiInsights: true,
    csvExport: true,
    excelExport: true,
    watermark: false,
    statementHistory: true,
    batchUpload: true,
    pdfReport: true,
    price: null,
  },
};

const PLAN_ORDER: PlanId[] = ["anonymous", "free", "starter", "pro", "business", "enterprise"];

export function getNextPlan(current: PlanId): PlanId | null {
  const idx = PLAN_ORDER.indexOf(current);
  if (idx === -1 || idx >= PLAN_ORDER.length - 1) return null;
  return PLAN_ORDER[idx + 1];
}

export function getPlanFeature(plan: PlanId, feature: keyof PlanConfig): PlanConfig[keyof PlanConfig] {
  return PLANS[plan]?.[feature] ?? PLANS.anonymous[feature];
}

export function hasFeature(plan: PlanId, feature: keyof Omit<PlanConfig, "name" | "pagesPerDay" | "pagesPerMonth" | "price" | "watermark">): boolean {
  return !!PLANS[plan]?.[feature];
}

export function getNextPlanUpgradeInfo(currentPlan: PlanId): {
  nextPlanId: PlanId;
  nextPlanConfig: PlanConfig;
  unlockedFeatures: string[];
} | null {
  const nextId = getNextPlan(currentPlan);
  if (!nextId) return null;
  const next = PLANS[nextId];
  const current = PLANS[currentPlan];

  const features: string[] = [];
  if (!current.aiInsights && next.aiInsights) features.push("AI-powered spending insights");
  if (!current.csvExport && next.csvExport) features.push("CSV export");
  if (!current.excelExport && next.excelExport) features.push("Excel export");
  if (!current.statementHistory && next.statementHistory) features.push("Statement history & cloud storage");
  if (!current.batchUpload && next.batchUpload) features.push("Batch upload multiple statements");
  if (!current.pdfReport && next.pdfReport) features.push("Downloadable PDF reports");
  if (current.watermark && !next.watermark) features.push("No watermark on exports");
  if (next.pagesPerMonth && (!current.pagesPerMonth || next.pagesPerMonth > current.pagesPerMonth)) {
    features.push(`${next.pagesPerMonth} pages per month`);
  }
  if (next.pagesPerDay && (!current.pagesPerDay || next.pagesPerDay > current.pagesPerDay)) {
    features.push(`${next.pagesPerDay} pages per day`);
  }

  return { nextPlanId: nextId, nextPlanConfig: next, unlockedFeatures: features.slice(0, 3) };
}

// Anonymous localStorage tracking
const ANON_DATE_KEY = "mms_anon_pages_date";
const ANON_USED_KEY = "mms_anon_pages_used";

export function getAnonUsage(): { date: string; used: number } {
  const today = new Date().toISOString().split("T")[0];
  const storedDate = localStorage.getItem(ANON_DATE_KEY);
  if (storedDate !== today) {
    localStorage.setItem(ANON_DATE_KEY, today);
    localStorage.setItem(ANON_USED_KEY, "0");
    return { date: today, used: 0 };
  }
  return { date: today, used: parseInt(localStorage.getItem(ANON_USED_KEY) || "0", 10) };
}

export function incrementAnonUsage(pages: number) {
  const { used } = getAnonUsage();
  localStorage.setItem(ANON_USED_KEY, String(used + pages));
}
