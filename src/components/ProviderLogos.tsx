import { motion } from "framer-motion";
import mtnLogo from "@/assets/mtn-logo.svg";
import airtelLogo from "@/assets/airtel-logo.svg";

const providers = [
  { name: "MTN MoMo", logo: mtnLogo, bg: "bg-[hsl(48,96%,53%)]" },
  { name: "Airtel Money", logo: airtelLogo, bg: "bg-white" },
];

const ProviderLogos = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-sm font-medium text-muted mb-6">Supports statements from</p>
        <div className="flex flex-wrap justify-center gap-6 items-center">
          {providers.map((p) => (
            <div
              key={p.name}
              className={`${p.bg} px-5 py-3 rounded-xl shadow-sm border border-border`}
            >
              <img src={p.logo} alt={p.name} className="h-8 w-auto" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProviderLogos;
