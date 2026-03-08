import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Shield, ArrowRight, Building2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import HowToPay from "@/components/HowToPay";

const tiers = [
  {
    name: "Anonymous",
    label: "Try it out",
    monthlyPrice: 0,
    annualPrice: 0,
    pageLimit: "1 page / day",
    features: [
      "No sign up needed",
      "Watermarked CSV export",
      "Basic dashboard view",
    ],
    cta: "Try it out",
    ctaLink: "/dashboard",
    style: "ghost" as const,
    popular: false,
  },
  {
    name: "Registered",
    label: "Get Started",
    monthlyPrice: 0,
    annualPrice: 0,
    pageLimit: "5 pages / day",
    features: [
      "Free Clerk account",
      "Full CSV export, no watermark",
      "AI Insights included",
      "Full dashboard access",
    ],
    cta: "Get Started",
    ctaLink: "/dashboard",
    style: "ghost" as const,
    popular: false,
  },
  {
    name: "Starter",
    label: "Most Popular",
    monthlyPrice: 15000,
    annualPrice: 150000,
    pageLimit: "150 pages / month",
    features: [
      "Full dashboard + all charts",
      "AI Insights",
      "CSV + Excel export",
      "Email support",
    ],
    cta: "Subscribe",
    ctaLink: "#",
    style: "solid" as const,
    popular: true,
  },
  {
    name: "Pro",
    label: "Power User",
    monthlyPrice: 30000,
    annualPrice: 300000,
    pageLimit: "300 pages / month",
    features: [
      "Everything in Starter",
      "Priority support",
      "Batch upload (multiple statements)",
      "Income vs Expense PDF report",
    ],
    cta: "Subscribe",
    ctaLink: "#",
    style: "solid" as const,
    popular: false,
  },
  {
    name: "Business",
    label: "For Teams",
    monthlyPrice: 50000,
    annualPrice: 500000,
    pageLimit: "1,000 pages / month",
    features: [
      "Everything in Pro",
      "Team access (up to 5 users)",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Subscribe",
    ctaLink: "#",
    style: "solid" as const,
    popular: false,
  },
  {
    name: "Enterprise",
    label: "Custom",
    monthlyPrice: -1,
    annualPrice: -1,
    pageLimit: "Unlimited pages",
    features: [
      "Everything in Business",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated infrastructure",
    ],
    cta: "Contact Us",
    ctaLink: "mailto:hello@momosense.com",
    style: "outline" as const,
    popular: false,
  },
];

const faqs = [
  {
    q: "What counts as a page?",
    a: "One page = one page of your PDF statement. A 10-page PDF counts as 10 pages toward your limit.",
  },
  {
    q: "Can I upgrade or downgrade?",
    a: "Yes, anytime from your account settings. Changes take effect immediately.",
  },
  {
    q: "How do I pay?",
    a: "Mobile Money (MTN MoMo & Airtel Money) — coming soon. Currently manual via bank transfer.",
  },
  {
    q: "Is my data safe?",
    a: "All processing is done in your browser. We never store your statement data on any server.",
  },
];

function formatUGX(amount: number): string {
  return amount.toLocaleString("en-UG");
}

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; plan: string; amount: number; period: "month" | "year" } | null>(null);

  const openPayment = (plan: string, amount: number) => {
    setPaymentModal({ open: true, plan, amount, period: annual ? "year" : "month" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="container mx-auto px-4 pt-16 pb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4"
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted text-lg max-w-xl mx-auto mb-8"
        >
          Start free, upgrade when you need more. All prices in Ugandan Shillings.
        </motion.p>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 bg-surface rounded-full p-1 border border-border shadow-sm"
        >
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              !annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              annual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            Annual <span className="text-xs opacity-80">(Save 20%)</span>
          </button>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier, i) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            const isPopular = tier.popular;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  isPopular
                    ? "bg-surface border-2 border-[hsl(40,55%,58%)] shadow-lg scale-[1.02]"
                    : "bg-surface border border-border shadow-card"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-[hsl(40,55%,58%)] text-[hsl(220,39%,11%)] text-xs font-bold px-3 py-1 rounded-full">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-heading font-bold text-lg text-foreground">{tier.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{tier.pageLimit}</p>
                </div>

                <div className="mb-5">
                  {price === 0 ? (
                    <span className="font-mono text-3xl font-bold text-foreground">Free</span>
                  ) : price === -1 ? (
                    <span className="font-mono text-3xl font-bold text-foreground">Custom</span>
                  ) : (
                    <div>
                      <span className="font-mono text-3xl font-bold text-foreground">
                        UGX {formatUGX(price)}
                      </span>
                      <span className="text-muted text-sm ml-1">
                        / {annual ? "year" : "month"}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {tier.style === "ghost" ? (
                  <Link
                    to={tier.ctaLink}
                    className="w-full py-2.5 rounded-[10px] text-center text-sm font-semibold border border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    {tier.cta}
                  </Link>
                ) : tier.style === "outline" ? (
                  <a
                    href={tier.ctaLink}
                    className="w-full py-2.5 rounded-[10px] text-center text-sm font-semibold border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors inline-block"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => openPayment(tier.name, price)}
                    className="w-full py-2.5 rounded-[10px] text-center text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    {tier.cta} — UGX {formatUGX(price)}/{annual ? "yr" : "mo"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How to Pay */}
      <HowToPay />

      {/* Payment Modal */}
      {paymentModal && (
        <PaymentModal
          open={paymentModal.open}
          onOpenChange={(open) => setPaymentModal(open ? paymentModal : null)}
          plan={paymentModal.plan}
          amount={paymentModal.amount}
          period={paymentModal.period}
        />
      )}

      {/* Trust Bar */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
          <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Payments secured</span>
          <span>Cancel anytime</span>
          <span>Built for Uganda 🇺🇬</span>
          <span>UGX pricing</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 pb-20 max-w-2xl">
        <h2 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-muted leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
