import { useState } from "react";
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
import { parsePDF, type ParsedStatement } from "@/lib/pdfParser";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState<ParsedStatement | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

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

      setData(result);
    } catch (err) {
      console.error("PDF parsing error:", err);
      toast.error("Failed to parse PDF. Please try a different file.");
    } finally {
      setLoading(false);
    }
  };

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
              Drop your PDF statement below to get instant insights into your spending.
            </p>
            <FileUpload onFileSelect={handleUpload} />
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
        {/* Validation error banner */}
        {data.validationError && (
          <Alert variant="destructive" className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Parsing Warning</AlertTitle>
            <AlertDescription>{data.validationError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            {data.accountHolder && (
              <p className="text-sm text-muted">Statement for <span className="font-semibold text-foreground">{data.accountHolder}</span></p>
            )}
            <p className="text-xs text-muted">
              Provider: {data.provider} · {data.transactions.length} transactions
              {data.dateRange.from && ` · ${data.dateRange.from} to ${data.dateRange.to}`}
            </p>
          </div>
          <button
            onClick={() => setData(null)}
            className="text-sm text-primary hover:underline"
          >
            Upload new statement
          </button>
        </div>

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
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
