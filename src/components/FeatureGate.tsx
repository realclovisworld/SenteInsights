import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type PlanId, hasFeature } from "@/lib/plans";

type GateMode = "hide" | "blur" | "disable";

interface FeatureGateProps {
  plan: PlanId;
  feature: "aiInsights" | "csvExport" | "excelExport" | "statementHistory" | "batchUpload" | "pdfReport";
  mode?: GateMode;
  lockMessage?: string;
  children: ReactNode;
}

const FeatureGate = ({ plan, feature, mode = "hide", lockMessage, children }: FeatureGateProps) => {
  const navigate = useNavigate();
  const clerk = useClerk();
  const allowed = hasFeature(plan, feature);

  if (allowed) return <>{children}</>;

  if (mode === "hide") return null;

  const isAnonymous = plan === "anonymous";
  const handleAction = () => {
    if (isAnonymous) clerk.openSignUp();
    else navigate("/pricing");
  };

  const actionLabel = isAnonymous ? "Create Free Account" : "Upgrade";

  if (mode === "blur") {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none filter blur-sm opacity-50">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl">
          <Lock className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-foreground font-medium text-center px-4 mb-3">
            {lockMessage || `Available on a higher plan`}
          </p>
          <Button size="sm" onClick={handleAction}>
            {actionLabel}
          </Button>
        </div>
      </div>
    );
  }

  // mode === "disable"
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 opacity-50 cursor-not-allowed">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{lockMessage || "Available on a higher plan"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FeatureGate;
