import { motion } from "framer-motion";

const DashboardMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="hidden md:block w-full max-w-[560px] mx-auto"
      style={{ perspective: "1200px" }}
    >
      <div className="w-full" style={{ transform: "rotateY(-2deg) rotateX(1deg)" }}>
        {/* Laptop Screen */}
        <div
          className="w-full rounded-t-2xl pt-3.5 px-3.5 relative"
          style={{
            background: "#1a1a2e",
            boxShadow: "0 -4px 0 #2a2a3e, 0 0 0 1px #2a2a3e, 0 -60px 120px rgba(26,122,74,0.15), 0 40px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Camera dot */}
          <div
            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ background: "#2a2a3e", border: "1px solid #3a3a4e" }}
          />

          {/* Screen bezel */}
          <div className="rounded-t-[10px] overflow-hidden" style={{ background: "#0d0d1a", border: "1px solid #2a2a3e" }}>
            {/* Browser bar */}
            <div className="flex items-center gap-2.5 px-3 py-2" style={{ background: "#1e1e2e", borderBottom: "1px solid #2a2a3e" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div
                className="flex-1 rounded-md px-3 py-1 font-mono text-[11px] flex items-center gap-1.5"
                style={{ background: "#2a2a3e", color: "#888" }}
              >
                🔒 app.senteinsights.me/dashboard
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{ background: "hsl(144 33% 97%)" }}>
              {/* Flag stripe */}
              <div className="flex h-[3px] w-full">
                <div className="flex-1" style={{ background: "#000" }} />
                <div className="flex-1" style={{ background: "#FCDC04" }} />
                <div className="flex-1" style={{ background: "#DE3908" }} />
                <div className="flex-1" style={{ background: "#000" }} />
                <div className="flex-1" style={{ background: "#FCDC04" }} />
                <div className="flex-1" style={{ background: "#DE3908" }} />
              </div>

              {/* Navbar */}
              <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "#fff", borderBottom: "1px solid #E5EDE8" }}>
                <div className="flex items-center gap-1.5 font-heading font-bold text-[14px]" style={{ color: "#111827" }}>
                  <div className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-[13px]" style={{ background: "#1A7A4A" }}>
                    💱
                  </div>
                  SenteInsights
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] text-white font-bold" style={{ background: "linear-gradient(135deg, #1A7A4A, #F4B942)" }}>
                    JN
                  </div>
                  <span className="text-[9px] font-semibold" style={{ color: "#1A7A4A" }}>Starter Plan</span>
                </div>
              </div>

              {/* Usage bar */}
              <div className="flex items-center justify-between px-4 py-1.5" style={{ background: "#E8F5EE" }}>
                <span className="text-[8px] font-semibold" style={{ color: "#1A7A4A" }}>📄 47 / 150 pages used this month</span>
                <div className="w-[120px] h-1 rounded-full overflow-hidden" style={{ background: "#C8E6D4" }}>
                  <div className="h-full rounded-full" style={{ background: "#1A7A4A", width: "31%" }} />
                </div>
              </div>

              {/* Dashboard body */}
              <div className="p-3">
                {/* User header */}
                <div className="flex items-start justify-between rounded-[10px] p-3 mb-2" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "#E8F5EE" }}>👤</div>
                      <div>
                        <p className="text-[13px] font-bold" style={{ color: "#111827" }}>Joan Namusoke</p>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FFF3CD", color: "#856404" }}>MTN MoMo</span>
                      </div>
                    </div>
                    <div className="flex gap-5 mt-2.5">
                      {[
                        { icon: "📞", label: "Phone", value: "0717989775" },
                        { icon: "✉️", label: "Email", value: "joan...@gmail.com" },
                        { icon: "📅", label: "Period", value: "20/12/25 – 19/02/26" },
                        { icon: "🏦", label: "Provider", value: "MTN MoMo" },
                      ].map((m) => (
                        <div key={m.label}>
                          <p className="text-[8px] uppercase tracking-wider flex items-center gap-1" style={{ color: "#6B7280" }}>
                            {m.icon} {m.label}
                          </p>
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: "#111827" }}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] mt-1.5" style={{ color: "#6B7280" }}>107 transactions found</p>
                  </div>
                  <button className="text-[9px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap" style={{ background: "transparent", border: "1px solid #1A7A4A", color: "#1A7A4A" }}>
                    ⬆ New Statement
                  </button>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { label: "↙ Total Money In", value: "UGX 454,091", color: "#1A7A4A" },
                    { label: "↗ Total Money Out", value: "UGX 465,485", color: "#E5534B" },
                    { label: "⚡ Net Balance", value: "UGX -11,394", color: "#E5534B" },
                    { label: "# Total Transactions", value: "107", color: "#111827", sub: "35 in · 72 out" },
                    { label: "💳 Total Fees Paid", value: "UGX 11,530", color: "#F4B942" },
                    { label: "🧾 Total Taxes Paid", value: "UGX 0", color: "#6B7280" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-[10px] p-2.5" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                      <p className="text-[8px] uppercase tracking-wider" style={{ color: "#6B7280" }}>{s.label}</p>
                      <p className="font-mono text-[15px] font-semibold mt-1" style={{ color: s.color }}>{s.value}</p>
                      {s.sub && <p className="text-[8px] mt-0.5" style={{ color: "#9CA3AF" }}>{s.sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Donut chart */}
                  <div className="rounded-[10px] p-3" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <p className="text-[10px] font-bold mb-2.5" style={{ color: "#111827" }}>Spending Categories</p>
                    <div className="flex items-center gap-3">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#E8F5EE" strokeWidth="12" />
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#1A7A4A" strokeWidth="12" strokeDasharray="105.6 188.4" strokeDashoffset="0" transform="rotate(-90 40 40)" />
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="30.1 188.4" strokeDashoffset="-105.6" transform="rotate(-90 40 40)" />
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#F4B942" strokeWidth="12" strokeDasharray="26.4 188.4" strokeDashoffset="-135.7" transform="rotate(-90 40 40)" />
                        <circle cx="40" cy="40" r="30" fill="none" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="26.4 188.4" strokeDashoffset="-162.1" transform="rotate(-90 40 40)" />
                      </svg>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { color: "#1A7A4A", label: "Payment (56%)" },
                          { color: "#3B82F6", label: "Other (16%)" },
                          { color: "#F4B942", label: "Food (14%)" },
                          { color: "#8B5CF6", label: "Airtime/Data (14%)" },
                        ].map((l) => (
                          <div key={l.label} className="flex items-center gap-1.5 text-[8.5px]" style={{ color: "#374151" }}>
                            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: l.color }} />
                            {l.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Line chart */}
                  <div className="rounded-[10px] p-3" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <p className="text-[10px] font-bold mb-2.5" style={{ color: "#111827" }}>Monthly Trends</p>
                    <div className="relative h-[80px]">
                      <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
                        <path d="M0,60 Q30,20 66,35 T133,25 T200,40" fill="none" stroke="#1A7A4A" strokeWidth="2" />
                        <path d="M0,50 Q30,40 66,55 T133,45 T200,30" fill="none" stroke="#E5534B" strokeWidth="2" strokeDasharray="4 3" />
                        <line x1="0" y1="78" x2="200" y2="78" stroke="#E5EDE8" strokeWidth="0.5" />
                        <text x="20" y="78" fill="#9CA3AF" fontSize="6" textAnchor="middle">Dec</text>
                        <text x="100" y="78" fill="#9CA3AF" fontSize="6" textAnchor="middle">Jan</text>
                        <text x="180" y="78" fill="#9CA3AF" fontSize="6" textAnchor="middle">Feb</text>
                      </svg>
                    </div>
                    <div className="flex gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[8px]" style={{ color: "#6B7280" }}>
                        <div className="w-3.5 h-0.5 rounded-sm" style={{ background: "#1A7A4A" }} /> Money In
                      </div>
                      <div className="flex items-center gap-1 text-[8px]" style={{ color: "#6B7280" }}>
                        <div className="w-3.5 h-0.5 rounded-sm" style={{ background: "#E5534B" }} /> Money Out
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Savings Goal */}
                  <div className="rounded-[10px] p-3" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <p className="text-[10px] font-bold flex items-center gap-1.5 mb-2" style={{ color: "#111827" }}>🎯 Savings Goal</p>
                    <p className="text-[8px] mb-1" style={{ color: "#6B7280" }}>Set your goal (UGX)</p>
                    <div className="rounded-md px-2 py-1.5 font-mono text-[9px] mb-1.5" style={{ background: "#F9F7F4", border: "1px solid #E5EDE8", color: "#374151" }}>500,000</div>
                    <div className="h-[5px] rounded-full overflow-hidden mb-1" style={{ background: "#E5EDE8" }}>
                      <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #1A7A4A, #28a86e)", width: "2%" }} />
                    </div>
                    <div className="flex justify-between font-mono text-[8px]" style={{ color: "#9CA3AF" }}>
                      <span>UGX -11,394</span>
                      <span>0%</span>
                    </div>
                    <p className="text-[8.5px] mt-1.5" style={{ color: "#374151" }}>🚀 Keep saving, every shilling counts!</p>
                  </div>

                  {/* Income Sources */}
                  <div className="rounded-[10px] p-3" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <p className="text-[10px] font-bold flex items-center gap-1.5 mb-2" style={{ color: "#111827" }}>↗ Income Sources</p>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { name: "VERTECH BIZ", pct: 85 },
                        { name: "WORLD REMIT", pct: 55 },
                        { name: "HOUSING BANK", pct: 40 },
                        { name: "INTELWORLD", pct: 25 },
                        { name: "PREPAID MC", pct: 15 },
                      ].map((s) => (
                        <div key={s.name} className="flex items-center gap-1.5">
                          <span className="text-[7.5px] font-mono w-[70px] flex-shrink-0 truncate" style={{ color: "#6B7280" }}>{s.name}</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E8F5EE" }}>
                            <div className="h-full rounded-full" style={{ background: "#1A7A4A", width: `${s.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop hinge */}
        <div className="h-1.5 -mx-2.5" style={{ background: "linear-gradient(180deg, #111 0%, #1a1a2e 100%)", borderRadius: "0 0 2px 2px" }} />

        {/* Laptop base */}
        <div className="w-full h-[18px] rounded-b relative" style={{ background: "linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160px] h-1 rounded-b" style={{ background: "#111" }} />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardMockup;
