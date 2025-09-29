import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, LogOut, Plus, TrendingUp, DollarSign, PiggyBank, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BudgetForm } from '@/components/BudgetForm';
import { BudgetOverview } from '@/components/BudgetOverview';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import AIChat from '@/components/AIChat';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  subscription_tier: string;
  display_name: string;
}

interface Budget {
  id: string;
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  emergency_fund: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
    fetchBudget();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, display_name')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setBudget(data[0]);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBudgetSaved = (newBudget: any) => {
    setShowBudgetForm(false);
    fetchBudget();
    toast({
      title: "Budget saved!",
      description: "Your budget has been successfully updated.",
    });
  };

  const handleUpgrade = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const isPremium = profile?.subscription_tier === 'premium';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Financial Dashboard</h1>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {profile?.display_name || user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Budget Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Budget</h2>
              <Button onClick={() => setShowBudgetForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {budget ? 'Update Budget' : 'Add Budget'}
              </Button>
            </div>

            {showBudgetForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Budget Information</CardTitle>
                  <CardDescription>
                    Enter your financial information to get personalized insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetForm 
                    initialBudget={budget ? {
                      monthlyIncome: budget.monthly_income,
                      monthlyExpenses: budget.monthly_expenses,
                      savings: budget.savings,
                      emergencyFund: budget.emergency_fund
                    } : undefined}
                    onBudgetUpdate={handleBudgetSaved}
                  />
                </CardContent>
              </Card>
            ) : budget ? (
              <BudgetOverview budget={{
                monthlyIncome: budget.monthly_income,
                monthlyExpenses: budget.monthly_expenses,
                savings: budget.savings,
                emergencyFund: budget.emergency_fund
              }} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <PiggyBank className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Budget Set</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Get started by adding your budget information
                  </p>
                  <Button onClick={() => setShowBudgetForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Budget
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* AI Chat Section - Premium Only */}
            {isPremium && budget && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    AI Financial Advisor
                  </CardTitle>
                  <CardDescription>
                    Get personalized financial advice based on your budget
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIChat budgetData={{
                    monthlyIncome: budget.monthly_income,
                    monthlyExpenses: budget.monthly_expenses,
                    savings: budget.savings,
                    emergencyFund: budget.emergency_fund
                  }} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {budget && (
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Income</p>
                        <p className="text-lg font-semibold">${budget.monthly_income.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                        <p className="text-lg font-semibold">${budget.monthly_expenses.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Emergency Fund</p>
                        <p className="text-lg font-semibold">${budget.emergency_fund.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Premium Upgrade */}
            {!isPremium && (
              <PremiumUpgrade onUpgrade={handleUpgrade} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}