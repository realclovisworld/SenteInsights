import { Phone, Copy, Check } from "lucide-react";
import { useState } from "react";

const numbers = [
  { label: "MTN MoMo", number: "0760 325 115", accent: "hsl(45, 100%, 51%)", bg: "hsl(45, 100%, 96%)" },
  { label: "Airtel Money", number: "0758 246 468", accent: "hsl(0, 80%, 50%)", bg: "hsl(0, 80%, 97%)" },
];

const HowToPay = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ""));
    setCopied(number);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="container mx-auto px-4 pb-16">
      <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-6">
        How to Pay
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {numbers.map((item) => (
          <div
            key={item.label}
            className="bg-[hsl(var(--surface,0_0%_100%))] border border-border rounded-xl p-5 border-l-4"
            style={{ borderLeftColor: item.accent }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: item.accent }}>
              {item.label}
            </p>
            <p className="text-xs text-muted-foreground mb-1">Send to:</p>
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-xl font-bold text-foreground">{item.number}</span>
              <button
                onClick={() => handleCopy(item.number)}
                className="p-1 rounded hover:bg-secondary transition-colors"
              >
                {copied === item.number ? (
                  <Check className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            </div>
            <p className="text-sm font-semibold text-foreground">GIDEON MAKU</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center mt-4 max-w-lg mx-auto">
        After sending, click your plan above and enter your transaction ID. Plans are activated within 2 hours.
      </p>
    </section>
  );
};

export default HowToPay;
