import { useState, useMemo, useCallback } from "react";
import { useAuth, useUser } from "@clerk/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import StatCards from "@/components/StatCards";
import SpendingChart from "@/components/SpendingChart";
import MonthlyTrend from "@/components/MonthlyTrend";
import SavingsGoal from "@/components/SavingsGoal";
import AIInsights from "@/components/AIInsights";
import TransactionTable from "@/components/TransactionTable";
import IncomeSourcesChart from "@/components/IncomeSourcesChart";
import AccountInfoCard from "@/components/AccountInfoCard";
import StatementHistory from "@/components/StatementHistory";
import { parsePDF, type ParsedStatement } from "@/lib/pdfParser";
import { saveStatementToSupabase, getOrCreateProfile, fetchFullStatement } from "@/lib/supabase-helpers";
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

  // Resolve user ID: Clerk userId for signed-in users, "anonymous" otherwise
  const effectiveUserId = userId || "anonymous";

  // Ensure profile exists when user signs in
  const ensureProfile = useCallback(async () => {
    if (!isSignedIn || !userId) return;
    try {
      await getOrCreateProfile(userId);
    } catch (err) {
      console.error("Error ensuring profile:", err);
    }
  }, [isSignedIn, userId]);

  // Create profile on first render when signed in
  useState(() => {
    if (isSignedIn && userId) {
      ensureProfile();
    }
  });

  const handleUpload = async (file: File) => {
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

      setLoadingStep(`Found ${result.transactions.length} transactions!`);
      await new Promise((r) => setTimeout(r, 400));

      // Save to Supabase in background
      setLoadingStep("Saving to your account…");
      try {
        const insightTexts = generateInsightTexts(result.transactions);
        const numPages = 1;
        await saveStatementToSupabase(effectiveUserId, result, numPages, insightTexts);
        setHistoryRefreshKey((k) => k + 1);
      } catch (saveErr) {
        console.error("Error saving to Supabase:", saveErr);
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
          <div className="max-w-2xl mx-auto mt-12">
            <StatementHistory onViewStatement={handleViewStatement} refreshKey={historyRefreshKey} userId={effectiveUserId} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
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
            <AIInsights transactions={data.transactions} />
          </div>
        </div>

        <TransactionTable transactions={data.transactions} />

        <StatementHistory onViewStatement={handleViewStatement} refreshKey={historyRefreshKey} userId={effectiveUserId} />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
