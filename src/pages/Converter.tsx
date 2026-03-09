import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface Row {
  date: string;
  description: string;
  type: string;
  amount: number;
  category: string;
}

const MOCK_ROWS: Row[] = [
  { date: "2024-03-15", description: "MTN MoMo - Jumia Food", type: "Sent", amount: 35000, category: "Food" },
  { date: "2024-03-15", description: "Salary Deposit", type: "Received", amount: 2500000, category: "Other" },
  { date: "2024-03-14", description: "SafeBoda Ride", type: "Sent", amount: 8000, category: "Transport" },
  { date: "2024-03-14", description: "UMEME Electricity", type: "Sent", amount: 120000, category: "Bills" },
  { date: "2024-03-13", description: "Airtime Purchase", type: "Sent", amount: 20000, category: "Airtime" },
];

const Converter = () => {
  const [hasFile, setHasFile] = useState(false);
  const [rows] = useState<Row[]>(MOCK_ROWS);

  const handleUpload = (_file: File) => {
    setHasFile(true);
  };

  const downloadCSV = () => {
    const header = "Date,Description,Type,Amount (UGX),Category\n";
    const csv = rows.map((r) => `${r.date},"${r.description}",${r.type},${r.amount},${r.category}`).join("\n");
    const blob = new Blob([header + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `senteinsights-statement-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            PDF to CSV Converter
          </h1>
          <p className="text-muted mb-8">
            Convert your mobile money or bank statement PDF into a clean, downloadable CSV file.
          </p>

          {!hasFile ? (
            <FileUpload onFileSelect={handleUpload} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="stat-card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted">Date</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted">Description</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted">Type</th>
                      <th className="text-right py-3 px-2 text-xs font-medium text-muted">Amount (UGX)</th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-background" : ""}`}>
                        <td className="py-3 px-2 font-mono text-xs">{r.date}</td>
                        <td className="py-3 px-2">{r.description}</td>
                        <td className="py-3 px-2 text-xs">{r.type}</td>
                        <td className="py-3 px-2 text-right font-mono">{r.amount.toLocaleString("en-UG")}</td>
                        <td className="py-3 px-2 text-xs">{r.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button size="lg" className="rounded-[10px] font-heading font-semibold gap-2 px-8" onClick={downloadCSV}>
                <Download className="w-5 h-5" />
                Download CSV
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Converter;
