import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { type PlanId, PLANS, getAnonUsage } from "@/lib/plans";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Star, Rocket, Briefcase } from "lucide-react";

interface UsageBarProps {
  plan: PlanId;
  pagesUsedToday?: number;
  pagesUsedMonth?: number;
}

const PLAN_ICONS: Record<string, React.ElementType> = {
  anonymous: Lock,
  free: Sparkles,
  starter: Star,
  pro: Rocket,
  business: Briefcase,
};

const UsageBar = ({ plan, pagesUsedToday = 0, pagesUsedMonth = 0 }: UsageBarProps) => {
  const navigate = useNavigate();
  const clerk = useClerk();
  const config = PLANS[plan];
  const Icon = PLAN_ICONS[plan] || Sparkles;

  let used: number;
  let limit: number;
  let label: string;
  let suffix: string;

  if (plan === "anonymous") {
    const anon = getAnonUsage();
    used = anon.used;
    limit = 1;
    label = "Anonymous";
    suffix = "pages used today";
  } else if (config.pagesPerDay) {
    used = pagesUsedToday;
    limit = config.pagesPerDay;
    label = `${config.name} Plan`;
    suffix = "pages used today";
  } else if (config.pagesPerMonth) {
    used = pagesUsedMonth;
    limit = config.pagesPerMonth;
    label = config.name;
    suffix = "pages used this month";
  } else {
    return null; // enterprise has no bar
  }

  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor = pct <= 60 ? "bg-[hsl(150,65%,29%)]" : pct <= 80 ? "bg-[hsl(40,90%,61%)]" : "bg-[hsl(6,72%,59%)]";
  const showUpgrade = pct > 80;

  const handleUpgrade = () => {
    if (plan === "anonymous") {
      clerk.openSignUp();
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-sm">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{label}</span>
          <span className="text-muted-foreground">
            · {used} / {limit.toLocaleString("en-UG")} {suffix}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {plan === "anonymous" && (
            <span className="text-xs text-muted-foreground">Sign up free for 5 pages/day</span>
          )}
          {plan === "free" && (
            <span className="text-xs text-muted-foreground">Upgrade for more</span>
          )}
          {showUpgrade && (
            <Button size="sm" variant="outline" className="h-6 text-xs px-2 rounded-full" onClick={handleUpgrade}>
              Upgrade
            </Button>
          )}
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default UsageBar;
