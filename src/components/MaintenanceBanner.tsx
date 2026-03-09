import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MaintenanceBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await (supabase as any)
        .from("admin_settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .single();
      setVisible(data?.value === "true");
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-amber-500 text-amber-950 text-center px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 z-[60] relative">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>SenteInsights is currently undergoing maintenance. Some features may be unavailable.</span>
    </div>
  );
};

export default MaintenanceBanner;
