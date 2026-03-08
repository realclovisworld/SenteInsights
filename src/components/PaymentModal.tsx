import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
  amount: number;
  period: "month" | "year";
}

const networks = [
  { id: "mtn", label: "MTN MoMo", number: "0760 325 115", color: "hsl(45, 100%, 51%)", borderClass: "border-l-[hsl(45,100%,51%)]" },
  { id: "airtel", label: "Airtel Money", number: "0758 246 468", color: "hsl(0, 80%, 50%)", borderClass: "border-l-[hsl(0,80%,50%)]" },
];

function formatUGX(amount: number): string {
  return amount.toLocaleString("en-UG");
}

const PaymentModal = ({ open, onOpenChange, plan, amount, period }: PaymentModalProps) => {
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [network, setNetwork] = useState("mtn");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ""));
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !transactionId.trim()) {
      toast({ title: "Missing fields", description: "Please fill in your email and transaction ID.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("payment_requests").insert({
      email: email.trim(),
      plan,
      amount_ugx: amount,
      network: networks.find(n => n.id === network)?.label ?? network,
      momo_transaction_id: transactionId.trim(),
      status: "pending",
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }

    setSubmitted(true);
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setSubmitted(false);
      setEmail("");
      setTransactionId("");
      setNetwork("mtn");
    }
    onOpenChange(val);
  };

  const selectedNet = networks.find(n => n.id === network)!;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Pay for {plan} Plan</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[hsl(150,65%,29%)]/10 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-foreground">Payment submitted!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              We'll verify your {selectedNet.label} payment of{" "}
              <strong>UGX {formatUGX(amount)}</strong> within 2 hours and activate your{" "}
              <strong>{plan}</strong> plan. You'll get a confirmation once it's active.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <Tabs defaultValue="mtn" onValueChange={(v) => setNetwork(v)}>
              <TabsList className="w-full">
                <TabsTrigger value="mtn" className="flex-1 text-xs sm:text-sm">MTN MoMo</TabsTrigger>
                <TabsTrigger value="airtel" className="flex-1 text-xs sm:text-sm">Airtel Money</TabsTrigger>
              </TabsList>

              {networks.map((net) => (
                <TabsContent key={net.id} value={net.id} className="space-y-3 mt-3">
                  <p className="text-sm text-muted-foreground">
                    Send the amount below to {net.label}:
                  </p>
                  <div className="bg-secondary rounded-xl p-4 text-center space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-mono text-2xl font-bold text-foreground tracking-wide">
                        {net.number}
                      </span>
                      <button
                        onClick={() => handleCopy(net.number)}
                        className="p-1 rounded hover:bg-primary/10 transition-colors"
                        title="Copy number"
                      >
                        {copiedNumber === net.number ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-foreground">GIDEON MAKU</p>
                    <p className="text-lg font-bold text-primary">UGX {formatUGX(amount)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Use your email address as the payment reference/reason.
                  </p>
                </TabsContent>
              ))}
            </Tabs>

            <div className="border-t border-border pt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Your email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  MoMo / Airtel Transaction ID
                </label>
                <Input
                  placeholder="e.g. 12345678901"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">The reference number from your confirmation SMS</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="mtn">MTN MoMo</option>
                  <option value="airtel">Airtel Money</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {plan} — UGX {formatUGX(amount)}/{period === "year" ? "yr" : "mo"}
                </Badge>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 rounded-[10px] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#1A7A4A" }}
              >
                {submitting ? "Submitting…" : "Submit Payment for Verification"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
