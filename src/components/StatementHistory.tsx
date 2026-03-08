import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchRecentStatements, type StatementSummary } from "@/lib/supabase-helpers";

interface StatementHistoryProps {
  onViewStatement: (statementId: string) => void;
  refreshKey?: number;
}

const StatementHistory = ({ onViewStatement, refreshKey }: StatementHistoryProps) => {
  const [statements, setStatements] = useState<StatementSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchRecentStatements(5);
      setStatements(data);
      setLoading(false);
    };
    load();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-muted" />
          <h3 className="font-heading font-semibold text-foreground">Previous Statements</h3>
        </div>
        <p className="text-sm text-muted">Loading history…</p>
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-muted" />
          <h3 className="font-heading font-semibold text-foreground">Previous Statements</h3>
        </div>
        <p className="text-sm text-muted">Your past statements will appear here after your first upload.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="stat-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Previous Statements</h3>
      </div>
      <div className="space-y-3">
        {statements.map((stmt) => {
          const dateRange = stmt.date_from && stmt.date_to
            ? `${stmt.date_from} — ${stmt.date_to}`
            : "No date range";

          return (
            <div
              key={stmt.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {stmt.provider || "Statement"}{stmt.account_name ? ` — ${stmt.account_name}` : ""}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {dateRange} · {stmt.total_transactions || 0} transactions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-sm font-mono font-semibold ${(stmt.net_balance || 0) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  UGX {(stmt.net_balance || 0).toLocaleString("en-UG")}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => onViewStatement(stmt.id)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StatementHistory;
