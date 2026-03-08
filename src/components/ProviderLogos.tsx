import { motion } from "framer-motion";

const providers = [
  { name: "MTN MoMo", color: "bg-yellow-400 text-yellow-900" },
  { name: "Airtel Money", color: "bg-red-500 text-white" },
  { name: "Equity Bank", color: "bg-red-700 text-white" },
  { name: "Stanbic Bank", color: "bg-blue-600 text-white" },
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
        <div className="flex flex-wrap justify-center gap-3">
          {providers.map((p) => (
            <span
              key={p.name}
              className={`${p.color} px-5 py-2 rounded-full text-sm font-semibold font-heading`}
            >
              {p.name}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProviderLogos;
