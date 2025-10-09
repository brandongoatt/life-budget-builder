import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Bell, DollarSign, User } from "lucide-react";
import { useTheme } from "next-themes";

interface SettingsData {
  display_name: string;
  email_notifications: boolean;
  savings_alert_threshold: number;
  expense_alert_threshold: number;
}

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savingsThreshold, setSavingsThreshold] = useState(20);
  const [expenseThreshold, setExpenseThreshold] = useState(80);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, email, subscription_tier')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setDisplayName(data.display_name || '');
      }

      // Load user preferences from localStorage for non-DB settings
      const savedNotifications = localStorage.getItem('emailNotifications');
      const savedSavingsThreshold = localStorage.getItem('savingsThreshold');
      const savedExpenseThreshold = localStorage.getItem('expenseThreshold');

      if (savedNotifications !== null) {
        setEmailNotifications(savedNotifications === 'true');
      }
      if (savedSavingsThreshold !== null) {
        setSavingsThreshold(parseInt(savedSavingsThreshold));
      }
      if (savedExpenseThreshold !== null) {
        setExpenseThreshold(parseInt(savedExpenseThreshold));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', user.id);

      if (error) throw error;

      // Save preferences to localStorage
      localStorage.setItem('emailNotifications', emailNotifications.toString());
      localStorage.setItem('savingsThreshold', savingsThreshold.toString());
      localStorage.setItem('expenseThreshold', expenseThreshold.toString());

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and app behavior
        </p>
      </div>

      {/* Account Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              This is how your name will appear in the app
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Theme</Label>
              <p className="text-xs text-muted-foreground">
                Choose your preferred color scheme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive email updates about your budget
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget Alert Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Budget Alerts
          </CardTitle>
          <CardDescription>
            Set thresholds for financial alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Minimum Savings Rate</Label>
              <span className="text-sm font-medium">{savingsThreshold}%</span>
            </div>
            <Slider
              value={[savingsThreshold]}
              onValueChange={([value]) => setSavingsThreshold(value)}
              min={0}
              max={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Alert when your savings rate falls below this threshold
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Maximum Expense Ratio</Label>
              <span className="text-sm font-medium">{expenseThreshold}%</span>
            </div>
            <Slider
              value={[expenseThreshold]}
              onValueChange={([value]) => setExpenseThreshold(value)}
              min={50}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Alert when your expenses exceed this percentage of income
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
};
