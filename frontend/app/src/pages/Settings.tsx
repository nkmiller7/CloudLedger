import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, User } from "@/hooks/use-auth";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [budget, setBudget] = useState(
    user?.monthly_budget?.toString() ?? "3500"
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsed = parseFloat(parseFloat(budget).toFixed(2));
    if (isNaN(parsed) || parsed <= 0) {
      toast({ title: "Invalid amount", description: "Budget must be a positive number", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ monthly_budget: parsed }),
      });
      if (res.ok) {
        const updatedUser: User = await res.json();
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast({ title: "Settings saved", description: `Monthly budget set to $${parsed.toFixed(2)}` });
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.reason || "Failed to save settings", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to connect to server", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Monthly Budget</CardTitle>
              <CardDescription>Set your monthly spending limit for the dashboard overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Amount ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              min="0"
              placeholder="3500.00"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This is the amount shown on your dashboard for budget tracking. Default is $3,500.00.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
