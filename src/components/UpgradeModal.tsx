import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, Check, Sparkles } from "lucide-react";
import { type PlanId, PLANS, getNextPlanUpgradeInfo } from "@/lib/plans";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanId;
  /** Custom message override */
  message?: string;
}

const UpgradeModal = ({ open, onOpenChange, currentPlan, message }: UpgradeModalProps) => {
  const navigate = useNavigate();
  const clerk = useClerk();
  const currentConfig = PLANS[currentPlan];
  const upgradeInfo = getNextPlanUpgradeInfo(currentPlan);

  const isAnonymous = currentPlan === "anonymous";
  const isBusiness = currentPlan === "business";

  const defaultMessage = isAnonymous
    ? "You've used your free page for today. Sign up free to get 5 pages per day — no payment needed."
    : isBusiness
      ? "You've reached your Business plan limit. Please contact us for Enterprise pricing."
      : `You've reached your ${currentConfig.name} plan limit.${upgradeInfo ? ` Upgrade to ${upgradeInfo.nextPlanConfig.name} for ${upgradeInfo.nextPlanConfig.pagesPerMonth ? `${upgradeInfo.nextPlanConfig.pagesPerMonth} pages per month` : "more capacity"}.` : ""}`;

  const handleCTA = () => {
    onOpenChange(false);
    if (isAnonymous) {
      clerk.openSignUp();
    } else if (isBusiness) {
      window.location.href = "mailto:contact@senteinsights.app";
    } else {
      navigate("/pricing");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            {isAnonymous ? <Sparkles className="w-6 h-6 text-primary" /> : <Lock className="w-6 h-6 text-primary" />}
          </div>
          <DialogTitle className="text-center">
            {isAnonymous ? "Create a Free Account" : isBusiness ? "Enterprise Plan" : `Upgrade to ${upgradeInfo?.nextPlanConfig.name}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {message || defaultMessage}
          </DialogDescription>
        </DialogHeader>

        {/* Current vs Next */}
        <div className="space-y-3 my-4">
          <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/30 border border-border">
            <span className="text-muted-foreground">Current: <strong className="text-foreground">{currentConfig.name}</strong></span>
            <span className="text-muted-foreground text-xs">
              {currentConfig.pagesPerDay ? `${currentConfig.pagesPerDay}/day` : currentConfig.pagesPerMonth ? `${currentConfig.pagesPerMonth}/mo` : "—"}
            </span>
          </div>
          {upgradeInfo && (
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-primary/5 border border-primary/20">
              <span className="text-foreground font-medium">
                <ArrowRight className="inline w-3.5 h-3.5 mr-1" />
                {upgradeInfo.nextPlanConfig.name}
              </span>
              <span className="text-primary font-semibold text-xs">
                {upgradeInfo.nextPlanConfig.price ? `UGX ${upgradeInfo.nextPlanConfig.price.toLocaleString("en-UG")}/mo` : "Free"}
              </span>
            </div>
          )}
        </div>

        {/* Unlocked features */}
        {upgradeInfo && upgradeInfo.unlockedFeatures.length > 0 && (
          <ul className="space-y-2 mb-4">
            {upgradeInfo.unlockedFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2">
          <Button onClick={handleCTA} className="w-full">
            {isAnonymous
              ? "Create Free Account"
              : isBusiness
                ? "Contact Us"
                : `Upgrade to ${upgradeInfo?.nextPlanConfig.name} — UGX ${upgradeInfo?.nextPlanConfig.price?.toLocaleString("en-UG")}/mo`}
          </Button>
          {!isAnonymous && (
            <Button variant="ghost" size="sm" onClick={() => { onOpenChange(false); navigate("/pricing"); }}>
              View all plans
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
