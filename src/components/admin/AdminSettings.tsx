import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchAdminSettings, updateAdminSetting } from "@/lib/admin-helpers";

interface SettingField {
  key: string;
  label: string;
  type: "text" | "number" | "toggle";
  group: string;
}

const FIELDS: SettingField[] = [
  { key: "free_daily_limit", label: "Free Plan Daily Limit", type: "number", group: "Plan Limits" },
  { key: "starter_monthly_limit", label: "Starter Monthly Limit", type: "number", group: "Plan Limits" },
  { key: "pro_monthly_limit", label: "Pro Monthly Limit", type: "number", group: "Plan Limits" },
  { key: "business_monthly_limit", label: "Business Monthly Limit", type: "number", group: "Plan Limits" },
  { key: "mtn_momo_number", label: "MTN MoMo Number", type: "text", group: "Payment Numbers" },
  { key: "airtel_number", label: "Airtel Number", type: "text", group: "Payment Numbers" },
  { key: "support_email", label: "Support Email", type: "text", group: "Contact" },
  { key: "maintenance_mode", label: "Maintenance Mode", type: "toggle", group: "System" },
];

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setSettings(await fetchAdminSettings());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const field of FIELDS) {
      if (settings[field.key] !== undefined) {
        await updateAdminSetting(field.key, settings[field.key]);
      }
    }
    toast.success("Settings saved");
    setSaving(false);
  };

  const groups = [...new Set(FIELDS.map((f) => f.group))];

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {groups.map((group) => (
        <div key={group} className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">{group}</h3>
          <div className="space-y-3">
            {FIELDS.filter((f) => f.group === group).map((field) => (
              <div key={field.key} className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-foreground min-w-0">{field.label}</label>
                {field.type === "toggle" ? (
                  <Switch
                    checked={settings[field.key] === "true"}
                    onCheckedChange={(c) => setSettings((s) => ({ ...s, [field.key]: c ? "true" : "false" }))}
                  />
                ) : (
                  <Input
                    type={field.type}
                    value={settings[field.key] || ""}
                    onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                    className="max-w-xs h-9"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={handleSave} disabled={saving} className="gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
