import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqItems = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is SenteInsights?",
        a: "SenteInsights is an AI-powered financial analysis tool that helps you understand your mobile money spending. Simply upload your MTN MoMo or Airtel Money PDF statement, and we instantly analyze your transactions, categorize spending, and provide actionable insights — all in your browser."
      },
      {
        q: "How do I get started?",
        a: "It's simple: 1) Visit the Dashboard, 2) Upload your PDF statement (no sign-up required for the first page), 3) Instantly see your transactions, spending breakdown, and financial insights. Sign up free to get 5 pages per day and unlock full features."
      },
      {
        q: "Do I need to create an account?",
        a: "No! You can analyze 1 page per day without an account. Create a free account to get 5 pages per day, remove watermarks, access AI insights, and save your analysis history."
      }
    ]
  },
  {
    category: "How It Works",
    items: [
      {
        q: "How does SenteInsights process my statement?",
        a: "When you upload a PDF, our parser runs entirely in your browser using advanced OCR technology. We extract transaction data, categorize each entry (payments, withdrawals, fees, etc.), and calculate spending patterns. Your original PDF file is never uploaded to any server."
      },
      {
        q: "What PDF files can I upload?",
        a: "We support MTN MoMo and Airtel Money PDF statements. The file should contain transaction records with dates, amounts, descriptions, and balance information. Most statement PDFs exported from the MTN MoMo or Airtel Money apps work perfectly."
      },
      {
        q: "What happens to my data after upload?",
        a: "Your PDF file stays entirely on your device — we never upload or store it. If you're logged in, we save only the extracted summary data (totals, categories, transactions) to your account. You can delete your data anytime from your dashboard."
      },
      {
        q: "Is my data really private?",
        a: "Yes, completely. All PDF processing happens in your browser before anything is sent anywhere. Your original PDF is never transmitted to our servers. Even the extracted data is encrypted and stored securely, only accessible to you."
      }
    ]
  },
  {
    category: "Features & Analysis",
    items: [
      {
        q: "What insights does SenteInsights provide?",
        a: "You get: Transaction categorization (food, transport, utilities, etc.), spending trends by category, money in vs. money out analysis, fee tracking, savings goals, income sources, and exportable reports. The free plan includes basic dashboard; paid plans unlock AI insights and advanced analytics."
      },
      {
        q: "Can I export my data?",
        a: "Yes! Download your transactions as CSV (Excel-compatible). Free users get CSV with a watermark. Registered users get clean exports. Pro and Business plans also support Excel files with advanced formatting."
      },
      {
        q: "Can I analyze multiple statements?",
        a: "Yes. You can upload multiple PDF statements to build a complete financial history. Free users can upload 1 page/day. Paid plans support batch uploads and track trends across months."
      },
      {
        q: "What are AI Insights?",
        a: "AI Insights (available on Starter plan and above) use machine learning to identify spending patterns, flag unusual transactions, suggest savings opportunities, and provide personalized financial advice based on your behavior."
      }
    ]
  },
  {
    category: "Plans & Payment",
    items: [
      {
        q: "What's the difference between plans?",
        a: "Anonymous: 1 page/day, watermarked exports. Registered (free): 5 pages/day, clean exports, AI insights. Starter: 150 pages/month, email support. Pro: 300 pages/month, priority support, batch upload. Business: 1,000 pages/month, team access (5 users), API access. Enterprise: Unlimited, custom features."
      },
      {
        q: "How much does a plan cost?",
        a: "Plans start at UGX 15,000/month for Starter (save 20% with annual). Prices are in Ugandan Shillings (UGX). See the Pricing page for the full breakdown of all plans and features."
      },
      {
        q: "How do I pay for a plan?",
        a: "We accept MTN MoMo and Airtel Money. Send the plan amount to the number shown on the Pricing page, then enter your transaction ID in the app. Your plan activates within 2 hours after verification. Payments are non-refundable once activated."
      },
      {
        q: "What happens when my plan expires?",
        a: "Your plan lasts 30 days from activation. When it expires, you revert to the free Registered tier (5 pages/day). Renew anytime by making another payment. You keep your data and history."
      },
      {
        q: "Can I upgrade or downgrade my plan?",
        a: "Yes! Upgrade anytime by paying for a new plan via Mobile Money. Your plan updates after verification. Downgrades take effect at the end of your current billing cycle."
      }
    ]
  },
  {
    category: "Account & Security",
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Register' in the top right, sign up with your email via Clerk (our secure auth provider), and you're done. You get a free account with 5 pages/day and access to AI insights immediately."
      },
      {
        q: "Can I delete my account and data?",
        a: "Yes. Contact us at hello@senteinsights.com with your email, and we'll permanently delete your account and all associated data within 48 hours. This is irreversible."
      },
      {
        q: "Who has access to my data?",
        a: "Only you. We use Supabase for encrypted storage and Clerk for secure authentication. We never share, sell, or access your personal data. We comply with privacy laws and best practices."
      },
      {
        q: "Do you store my Mobile Money credentials?",
        a: "No, never. We only collect Mobile Money transaction IDs for payment verification. We don't ask for or store your PIN, password, or account credentials."
      }
    ]
  },
  {
    category: "Troubleshooting",
    items: [
      {
        q: "Why isn't my PDF uploading?",
        a: "Make sure the file is a valid PDF from MTN MoMo or Airtel Money. File size should be under 20MB. Try using a different browser or clearing your cache. If it still fails, email support@senteinsights.app with the file."
      },
      {
        q: "Why are some transactions not recognized?",
        a: "Our parser is highly accurate but may struggle with unusual formats, handwritten notes, or scanned PDFs. If transactions are missing, you can manually add notes or contact us for help."
      },
      {
        q: "What if I reach my page limit?",
        a: "You'll see a notification before hitting your limit. Upgrade your plan to add more pages, or wait for your next billing cycle. Unused pages don't roll over."
      },
      {
        q: "Can I use SenteInsights on my phone?",
        a: "Yes, the web app is fully responsive. Upload PDFs via your phone browser (most phones can export PDFs from the MTN MoMo or Airtel Money apps). For a better experience, we recommend desktop for detailed analysis."
      },
      {
        q: "How do I contact support?",
        a: "Email support@senteinsights.app for technical issues, or hello@senteinsights.com for general inquiries and partnership. We respond within 24 hours."
      }
    ]
  }
];

const ComprehensiveFAQ = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to know
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Comprehensive FAQ covering all aspects of SenteInsights, from getting started to advanced features
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {faqItems.map((category, categoryIdx) => (
            <div key={category.category}>
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item, itemIdx) => {
                  const itemId = `${categoryIdx}-${itemIdx}`;
                  const isExpanded = expandedItems.includes(itemId);

                  return (
                    <motion.div
                      key={itemId}
                      initial={false}
                      layout
                      className="border border-blue-200 rounded-lg overflow-hidden bg-blue-50/40 hover:border-blue-300 transition-colors"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-50/80 transition-colors"
                      >
                        <h4 className="font-semibold text-foreground text-sm md:text-base pr-4">
                          {item.q}
                        </h4>
                        <ChevronDown
                          className="w-5 h-5 text-blue-600 flex-shrink-0 transition-transform duration-300"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </button>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-blue-200 px-5 py-4 bg-white"
                        >
                          <p className="text-muted text-sm md:text-base leading-relaxed">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.2 }}
          className="text-center mt-16"
        >
          <p className="text-muted">
            Can't find your answer?{" "}
            <a
              href="mailto:hello@senteinsights.com"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComprehensiveFAQ;
