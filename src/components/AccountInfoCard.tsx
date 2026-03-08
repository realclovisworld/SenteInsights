import { motion } from "framer-motion";
import { User, Phone, Mail, Calendar, Building2, UploadCloud } from "lucide-react";

interface AccountInfoCardProps {
  accountHolder: string;
  phoneNumber: string;
  emailAddress: string;
  provider: string;
  statementPeriod: string;
  totalTransactions: number;
  onUploadNew: () => void;
}

const providerColors: Record<string, string> = {
  "MTN MoMo": "bg-[hsl(48,96%,53%)] text-[hsl(220,39%,11%)]",
  "Airtel Money": "bg-[hsl(4,73%,59%)] text-[hsl(0,0%,100%)]",
};

const AccountInfoCard = ({
  accountHolder, phoneNumber, emailAddress, provider,
  statementPeriod, totalTransactions, onUploadNew
}: AccountInfoCardProps) => {
  const badgeClass = providerColors[provider] || "bg-muted text-foreground";

  const details = [
    { icon: User, label: "Customer Name", value: accountHolder },
    { icon: Phone, label: "Phone Number", value: phoneNumber },
    { icon: Mail, label: "Email Address", value: emailAddress },
    { icon: Calendar, label: "Statement Period", value: statementPeriod },
    { icon: Building2, label: "Provider", value: provider },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-foreground text-base sm:text-lg">
              {accountHolder || "Account Holder"}
            </h2>
            <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${badgeClass}`}>
              {provider || "Unknown Provider"}
            </span>
          </div>
        </div>
        <button
          onClick={onUploadNew}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors self-start"
        >
          <UploadCloud className="w-4 h-4" />
          New Statement
        </button>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {details.map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted">
              <d.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-medium">{d.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {d.value || "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted">
          {totalTransactions} transactions found
        </p>
      </div>
    </motion.div>
  );
};

export default AccountInfoCard;
