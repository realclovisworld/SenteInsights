import { motion } from "framer-motion";
import mtnLogo from "@/assets/mtn-logo.svg";
import airtelLogo from "@/assets/airtel-logo.svg";

const providers = [
  { name: "MTN MoMo", logo: mtnLogo, bg: "bg-[hsl(48,96%,53%)]" },
  { name: "Airtel Money", logo: airtelLogo, bg: "bg-white" },
];

const ProviderLogos = () => {
  return (
    <section className="container mx-auto px-5 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="text-center"
      >
        <p className="text-xs font-semibold text-muted tracking-wide uppercase mb-6">Supports statements from</p>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {providers.map((p) => (
            <div
              key={p.name}
              className={`${p.bg} px-6 py-3 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow`}
            >
              <img src={p.logo} alt={p.name} className="h-7 w-auto" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProviderLogos;
