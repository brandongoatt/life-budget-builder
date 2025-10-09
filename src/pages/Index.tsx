import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { BudgetForm } from '@/components/BudgetForm';
import { BudgetOverview } from '@/components/BudgetOverview';
import { DecisionCalculator } from '@/components/DecisionCalculator';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import AIChat from '@/components/AIChat';
import { AppSidebar } from '@/components/AppSidebar';
import { FinancialTrends } from '@/components/FinancialTrends';
import { DecisionHistory } from '@/components/DecisionHistory';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Shield, Calculator, MessageCircle, DollarSign, Target, BarChart3, Users } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface BudgetData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  emergencyFund: number;
}

interface UserProfile {
  subscription_tier: string;
  display_name?: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load user profile and budget data
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserBudget();
    } else {
      setBudget(null);
      setShowCalculator(false);
      setUserProfile(null);
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, display_name')
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUserBudget = async () => {
    setLoadingBudget(true);
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBudget({
          monthlyIncome: Number(data.monthly_income),
          monthlyExpenses: Number(data.monthly_expenses),
          savings: Number(data.savings),
          emergencyFund: Number(data.emergency_fund)
        });
        setShowCalculator(true);
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    } finally {
      setLoadingBudget(false);
    }
  };

  const handleBudgetUpdate = async (newBudget: BudgetData) => {
    if (!user) {
      // For guests, just update local state
      setBudget(newBudget);
      setShowCalculator(true);
      toast({
        title: "Budget updated!",
        description: "Sign in to save your data permanently.",
      });
      return;
    }

    try {
      // Deactivate old budgets
      await supabase
        .from('budgets')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Insert new budget
      const { error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          monthly_income: newBudget.monthlyIncome,
          monthly_expenses: newBudget.monthlyExpenses,
          savings: newBudget.savings,
          emergency_fund: newBudget.emergencyFund,
          is_active: true
        });

      if (error) throw error;

      setBudget(newBudget);
      setShowCalculator(true);

      toast({
        title: "Budget saved!",
        description: "Your budget data has been securely saved.",
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error saving budget",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePremiumUpgrade = () => {
    loadUserProfile(); // Reload profile to get updated subscription tier
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isPremium = userProfile?.subscription_tier === 'premium';

  const renderTabContent = () => {
    if (!budget) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <BudgetOverview budget={budget} />
            <DecisionCalculator budget={budget} />
          </div>
        );
      case 'trends':
        return <FinancialTrends budget={budget} isPremium={isPremium} />;
      case 'history':
        return <DecisionHistory />;
      case 'settings':
        return (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation userProfile={userProfile} />

      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  {user ? (userProfile?.subscription_tier === 'premium' ? 'Premium AI Advisor' : 'Free Analysis + Premium Available') : 'Free Financial Analysis'}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Smart Financial
                  <span className="text-primary"> Decision Tool</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Make informed choices about housing, cars, education, and major life changes with {user && userProfile?.subscription_tier === 'premium' ? 'AI-powered insights and' : ''} personalized recommendations.
                </p>
              </div>
              
              {user && userProfile?.subscription_tier === 'premium' && (
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Premium Member
                  </Badge>
                  <span className="text-sm text-muted-foreground">AI advisor included</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <Calculator className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Budget Analysis</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">Smart Recommendations</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{user ? 'Secure Data Storage' : 'Privacy Protected'}</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <MessageCircle className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">AI Financial Advisor</span>
                </div>
              </div>

              {!user && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="flex-1">
                    <a href="/auth">Sign Up Free</a>
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    Try Demo Below
                  </Button>
                </div>
              )}
            </div>
            
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src={heroImage} 
                  alt="Professional financial planning and budget analysis dashboard" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {!user ? (
          /* Guest Experience */
          <div className="space-y-8">
            {/* Social Proof */}
            <div className="text-center py-8">
              <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>10,000+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>50,000+ decisions analyzed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Bank-level security</span>
                </div>
              </div>
            </div>

            {/* Sign Up CTA */}
            <Card className="max-w-2xl mx-auto border-2 border-dashed border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Get Started Today</CardTitle>
                <CardDescription>
                  Sign up to save your budget data, access premium AI features, and track your financial progress over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium">Budget Tracking</h4>
                    <p className="text-xs text-muted-foreground">Save and track your financial data</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium">Decision History</h4>
                    <p className="text-xs text-muted-foreground">Track all your financial decisions</p>
                  </div>
                  <div className="text-center">
                    <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium">AI Advisor</h4>
                    <p className="text-xs text-muted-foreground">Get personalized advice</p>
                  </div>
                </div>
                <Button asChild className="w-full" size="lg">
                  <a href="/auth">Sign Up Free</a>
                </Button>
              </CardContent>
            </Card>

            {/* Demo Form */}
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Try the Calculator (Demo Mode)</h3>
                <p className="text-muted-foreground">Experience our financial analysis tool - no account required</p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {showCalculator && budget && (
                    <BudgetOverview budget={budget} />
                  )}
                  
                  <BudgetForm 
                    onBudgetUpdate={handleBudgetUpdate} 
                    initialBudget={budget || undefined}
                  />
                  
                  {showCalculator && budget && (
                    <DecisionCalculator budget={budget} />
                  )}
                </div>
                
                <div>
                  <PremiumUpgrade />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated User Experience with Sidebar */
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar 
                isPremium={isPremium}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              
              <div className="flex-1">
                <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                  <div className="flex h-14 items-center gap-4 px-6">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">
                      {activeTab === 'dashboard' && 'Dashboard'}
                      {activeTab === 'trends' && 'Financial Trends'}
                      {activeTab === 'history' && 'Decision History'}
                      {activeTab === 'settings' && 'Settings'}
                    </h1>
                  </div>
                </header>

                <main className="p-6">
                  {loadingBudget ? (
                    <Card className="shadow-card">
                      <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">Loading your budget...</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : !budget ? (
                    <div className="max-w-2xl mx-auto">
                      <Card className="shadow-card">
                        <CardHeader>
                          <CardTitle>Welcome! Let's Get Started</CardTitle>
                          <CardDescription>
                            Enter your budget information to start tracking your finances
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <BudgetForm 
                            onBudgetUpdate={handleBudgetUpdate} 
                            initialBudget={budget || undefined}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        {renderTabContent()}
                      </div>

                      <div className="space-y-6">
                        {/* Budget Form Card */}
                        <Card className="shadow-card">
                          <CardHeader>
                            <CardTitle className="text-lg">Update Budget</CardTitle>
                            <CardDescription>Modify your financial information</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <BudgetForm 
                              onBudgetUpdate={handleBudgetUpdate} 
                              initialBudget={budget}
                            />
                          </CardContent>
                        </Card>

                        {/* Premium Features */}
                        {isPremium ? (
                          <AIChat budgetData={budget} />
                        ) : (
                          <PremiumUpgrade onUpgrade={handlePremiumUpgrade} />
                        )}
                      </div>
                    </div>
                  )}
                </main>
              </div>
            </div>
          </SidebarProvider>
        )}

        {/* Features Section */}
        {!showCalculator && (
          <section className="py-8 sm:py-12 mt-16">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Comprehensive Financial Analysis</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Get data-driven insights for major life decisions. Our tool analyzes your complete financial picture.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-card/95 backdrop-blur-sm rounded-xl shadow-card border-0 hover:shadow-elevated transition-all duration-200 group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Enter Your Budget</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Input your income, expenses, savings, and emergency fund details
                </p>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-card/95 backdrop-blur-sm rounded-xl shadow-card border-0 hover:shadow-elevated transition-all duration-200 group">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                  <span className="text-secondary font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Select Decision Type</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Choose from housing, vehicle, education, or relocation analysis
                </p>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-card/95 backdrop-blur-sm rounded-xl shadow-card border-0 hover:shadow-elevated transition-all duration-200 group">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <span className="text-accent font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Get Deep Analysis</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Receive detailed impact assessment with risk analysis and alternatives
                </p>
              </div>
              
              <div className="text-center p-4 sm:p-6 bg-card/95 backdrop-blur-sm rounded-xl shadow-card border-0 hover:shadow-elevated transition-all duration-200 group">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-warning/20 transition-colors">
                  <span className="text-warning font-bold text-lg">4</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base">Make Smart Decisions</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Use insights and recommendations to make confident financial choices
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/95 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Smart Financial Decision Tool. Empowering informed financial choices.
            </p>
            <p className="text-xs text-muted-foreground">
              {user && userProfile?.subscription_tier === 'premium' ? 
                'Premium AI-powered financial analysis' : 
                'Free financial analysis tool with premium AI features available'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;