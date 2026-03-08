import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth, useUser } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import BatchFileUpload, { type BatchFileItem } from "@/components/BatchFileUpload";
import StatCards from "@/components/StatCards";
import SpendingChart from "@/components/SpendingChart";
import MonthlyTrend from "@/components/MonthlyTrend";
import SavingsGoal from "@/components/SavingsGoal";
import AIInsights from "@/components/AIInsights";
import TransactionTable from "@/components/TransactionTable";
import IncomeSourcesChart from "@/components/IncomeSourcesChart";
import AccountInfoCard from "@/components/AccountInfoCard";
import StatementHistory from "@/components/StatementHistory";
import UsageBar from "@/components/UsageBar";
import UpgradeModal from "@/components/UpgradeModal";
import FeatureGate from "@/components/FeatureGate";
import { parsePDF, type ParsedStatement } from "@/lib/pdfParser";
import { saveStatementToSupabase, getOrCreateProfile, fetchFullStatement } from "@/lib/supabase-helpers";
import { type PlanId, PLANS, getAnonUsage, incrementAnonUsage } from "@/lib/plans";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

function generateInsightTexts(transactions: ParsedStatement["transactions"]): string[] {
  if (!transactions || transactions.length === 0) return [];
  const result: string[] = [];
  const categoryTotals: Record<string, number> = {};
  const incomeSources: Record<string, number> = {};
  let totalOut = 0;
  let totalFees = 0;

  for (const t of transactions) {
    if (t.type === "sent") {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalOut += t.amount;
    } else {
      const sender = t.from?.trim() || t.description?.trim() || "Unknown";
      incomeSources[sender] = (incomeSources[sender] || 0) + t.amount;
    }
    totalFees += t.fees;
  }

  const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  if (sortedCats.length > 0) {
    const [topCat, topAmt] = sortedCats[0];
    const pct = totalOut > 0 ? Math.round((topAmt / totalOut) * 100) : 0;
    result.push(`Your top spending category is ${topCat} at ${pct}% of total outgoing (UGX ${topAmt.toLocaleString("en-UG")}).`);
  }

  const dayTotals: Record<string, number> = {};
  for (const t of transactions) {
    if (t.type === "sent") dayTotals[t.date] = (dayTotals[t.date] || 0) + t.amount;
  }
  const sortedDays = Object.entries(dayTotals).sort((a, b) => b[1] - a[1]);
  if (sortedDays.length > 0) {
    const [topDay, dayAmt] = sortedDays[0];
    result.push(`Your highest spending day was ${topDay} with UGX ${dayAmt.toLocaleString("en-UG")} spent.`);
  }

  const sortedIncome = Object.entries(incomeSources).sort((a, b) => b[1] - a[1]);
  if (sortedIncome.length > 0) {
    const [topSrc, srcAmt] = sortedIncome[0];
    result.push(`Your largest income source is "${topSrc}" with UGX ${srcAmt.toLocaleString("en-UG")} received.`);
  }

  if (totalFees > 0) {
    result.push(`You paid UGX ${totalFees.toLocaleString("en-UG")} in transaction fees. Consider consolidating transactions to reduce fees.`);
  }

  return result.slice(0, 5);
}

const Dashboard = () => {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const [data, setData] = useState<ParsedStatement | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  // Profile state for plan & usage
  const [userPlan, setUserPlan] = useState<PlanId>("anonymous");
  const [pagesUsedToday, setPagesUsedToday] = useState(0);
  const [pagesUsedMonth, setPagesUsedMonth] = useState(0);

  const effectiveUserId = userId || "anonymous";

  // Load profile on mount
  useEffect(() => {
    if (!isSignedIn || !userId) {
      setUserPlan("anonymous");
      return;
    }
    (async () => {
      try {
        const profile = await getOrCreateProfile(userId);
        if (profile) {
          const plan = (profile.plan || "free") as PlanId;
          setUserPlan(PLANS[plan] ? plan : "free");
          setPagesUsedToday(profile.pages_used_today || 0);
          setPagesUsedMonth(profile.pages_used_month || 0);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    })();
  }, [isSignedIn, userId]);

  // Upload gate check
  const checkUploadAllowed = useCallback((numPages: number): boolean => {
    const plan = userPlan;
    const config = PLANS[plan];

    if (plan === "anonymous") {
      const { used } = getAnonUsage();
      if (used + numPages > 1) {
        setUpgradeMessage("You've used your free page for today. Sign up free to get 5 pages per day — no payment needed.");
        setUpgradeOpen(true);
        return false;
      }
      return true;
    }

    if (config.pagesPerDay) {
      if (pagesUsedToday + numPages > config.pagesPerDay) {
        setUpgradeMessage(`You've used your ${config.pagesPerDay} free pages for today. Upgrade to Starter for 150 pages per month.`);
        setUpgradeOpen(true);
        return false;
      }
    }

    if (config.pagesPerMonth) {
      if (pagesUsedMonth + numPages > config.pagesPerMonth) {
        if (plan === "business") {
          setUpgradeMessage("You've reached your Business plan limit. Please contact us for Enterprise pricing.");
        } else {
          setUpgradeMessage(`You've reached your ${config.name} plan limit of ${config.pagesPerMonth} pages this month.`);
        }
        setUpgradeOpen(true);
        return false;
      }
    }

    return true;
  }, [userPlan, pagesUsedToday, pagesUsedMonth]);

  const handleUpload = async (file: File) => {
    // Pre-check with 1 page estimate (will refine after parse)
    if (!checkUploadAllowed(1)) return;

    setLoading(true);
    try {
      setLoadingStep("Reading statement…");
      await new Promise((r) => setTimeout(r, 500));

      setLoadingStep("Extracting all pages…");
      const result = await parsePDF(file);

      setLoadingStep("Categorizing transactions…");
      await new Promise((r) => setTimeout(r, 400));

      if (result.transactions.length === 0) {
        toast.error("No transactions found in this PDF. Please check the format.");
        setLoading(false);
        return;
      }

      const numPages = 1; // simplified

      // Re-check with actual page count
      if (!checkUploadAllowed(numPages)) {
        setLoading(false);
        return;
      }

      setLoadingStep(`Found ${result.transactions.length} transactions!`);
      await new Promise((r) => setTimeout(r, 400));

      // Track anonymous usage
      if (userPlan === "anonymous") {
        incrementAnonUsage(numPages);
      }

      // Save to Supabase
      if (isSignedIn && userId) {
        setLoadingStep("Saving to your account…");
        try {
          const insightTexts = generateInsightTexts(result.transactions);
          await saveStatementToSupabase(effectiveUserId, result, numPages, insightTexts);
          setHistoryRefreshKey((k) => k + 1);
          setPagesUsedToday((p) => p + numPages);
          setPagesUsedMonth((p) => p + numPages);
        } catch (saveErr) {
          console.error("Error saving to Supabase:", saveErr);
        }
      }

      setData(result);
    } catch (err) {
      console.error("PDF parsing error:", err);
      toast.error("Failed to parse PDF. Please try a different file.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStatement = useCallback(async (statementId: string) => {
    setLoading(true);
    setLoadingStep("Loading saved statement…");
    try {
      const stmt = await fetchFullStatement(statementId);
      if (stmt && stmt.transactions.length > 0) {
        setData(stmt);
      } else {
        toast.error("Could not load statement. Try re-uploading.");
      }
    } catch (err) {
      console.error("Error loading statement:", err);
      toast.error("Failed to load statement.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary animate-ping" />
            </div>
            <p className="font-heading font-semibold text-lg text-foreground mb-2">{loadingStep}</p>
            <div className="w-full bg-border rounded-full h-2 mt-4">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Your Statement
            </h1>
            <p className="text-muted mb-8">
              {isSignedIn
                ? `Welcome${user?.firstName ? `, ${user.firstName}` : ""}! Drop your PDF statement below to get instant insights.`
                : "Drop your PDF statement below to get instant insights into your spending."}
            </p>
            <FileUpload onFileSelect={handleUpload} />
          </div>
          <div className="max-w-2xl mx-auto mt-8 space-y-6">
            <UsageBar plan={userPlan} pagesUsedToday={pagesUsedToday} pagesUsedMonth={pagesUsedMonth} />
            <FeatureGate plan={userPlan} feature="statementHistory" mode="blur" lockMessage="Statement history available on Starter plan and above">
              <StatementHistory onViewStatement={handleViewStatement} refreshKey={historyRefreshKey} userId={effectiveUserId} />
            </FeatureGate>
          </div>
        </div>
        <Footer />
        <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} currentPlan={userPlan} message={upgradeMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <UsageBar plan={userPlan} pagesUsedToday={pagesUsedToday} pagesUsedMonth={pagesUsedMonth} />

        {data.validationError && (
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Parsing Warning</AlertTitle>
            <AlertDescription>{data.validationError}</AlertDescription>
          </Alert>
        )}

        <AccountInfoCard
          accountHolder={data.accountHolder}
          phoneNumber={data.phoneNumber}
          emailAddress={data.emailAddress}
          provider={data.provider}
          statementPeriod={data.statementPeriod}
          totalTransactions={data.transactions.length}
          onUploadNew={() => setData(null)}
        />

        <StatCards
          totalIn={data.totalIn}
          totalOut={data.totalOut}
          netBalance={data.netBalance}
          totalTransactions={data.transactions.length}
          totalFees={data.totalFees}
          totalTaxes={data.totalTaxes}
          incomingCount={data.incomingCount}
          outgoingCount={data.outgoingCount}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SpendingChart transactions={data.transactions} />
            <SavingsGoal netBalance={data.netBalance} />
          </div>
          <div className="space-y-6">
            <MonthlyTrend transactions={data.transactions} />
            <IncomeSourcesChart transactions={data.transactions} />
            <FeatureGate plan={userPlan} feature="aiInsights" mode="blur" lockMessage="Sign up free to unlock AI Insights">
              <AIInsights transactions={data.transactions} />
            </FeatureGate>
          </div>
        </div>

        <TransactionTable transactions={data.transactions} plan={userPlan} />

        <FeatureGate plan={userPlan} feature="statementHistory" mode="blur" lockMessage="Statement history available on Starter plan and above">
          <StatementHistory onViewStatement={handleViewStatement} refreshKey={historyRefreshKey} userId={effectiveUserId} />
        </FeatureGate>
      </div>
      <Footer />
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} currentPlan={userPlan} message={upgradeMessage} />
    </div>
  );
};

export default Dashboard;
