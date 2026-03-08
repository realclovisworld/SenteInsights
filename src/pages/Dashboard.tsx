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
import { motion } from "framer-motion";

const Dashboard = () => {
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const handleUpload = async (_file: File) => {
    setLoading(true);
    setLoadingStep("Reading statement…");
    await new Promise((r) => setTimeout(r, 1200));
    setLoadingStep("Categorizing transactions…");
    await new Promise((r) => setTimeout(r, 1000));
    setLoadingStep("Generating insights…");
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setHasData(true);
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

  if (!hasData) {
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
        <StatCards
          totalIn={5250000}
          totalOut={3700000}
          netBalance={1550000}
          totalTransactions={12}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SpendingChart />
            <SavingsGoal netBalance={1550000} />
          </div>
          <div className="space-y-6">
            <MonthlyTrend />
            <AIInsights />
          </div>
        </div>

        <TransactionTable />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
