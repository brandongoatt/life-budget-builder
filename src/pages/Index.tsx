import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { BudgetForm } from '@/components/BudgetForm';
import { BudgetOverview } from '@/components/BudgetOverview';
import { DecisionCalculator } from '@/components/DecisionCalculator';
import PremiumUpgrade from '@/components/PremiumUpgrade';
import AIChat from '@/components/AIChat';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation userProfile={userProfile} />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-semibold shadow-lg">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                  {user ? (userProfile?.subscription_tier === 'premium' ? '✨ Premium AI Advisor Active' : '🚀 Upgrade to Premium') : '💡 Free Financial Analysis'}
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Smart Financial
                  <span className="block gradient-primary bg-clip-text text-transparent mt-2">Decision Making</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Make confident choices about housing, cars, education, and major life changes with {user && userProfile?.subscription_tier === 'premium' ? 'AI-powered insights and' : ''} data-driven recommendations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl gradient-card border border-primary/20 shadow-card hover:shadow-elevated transition-all group">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <Calculator className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold">Budget Analysis</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl gradient-card border border-secondary/20 shadow-card hover:shadow-elevated transition-all group">
                  <div className="w-10 h-10 gradient-secondary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-semibold">Smart Insights</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl gradient-card border border-accent/20 shadow-card hover:shadow-elevated transition-all group">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-semibold">Secure & Private</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-xl gradient-card border border-warning/20 shadow-card hover:shadow-elevated transition-all group">
                  <div className="w-10 h-10 gradient-premium rounded-lg flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold">AI Advisor</span>
                </div>
              </div>

              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="gradient-primary shadow-glow text-primary-foreground font-semibold">
                    <a href="/auth">Get Started Free</a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-2">
                    Try Demo Below
                  </Button>
                </div>
              )}
            </div>
            
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated hover:shadow-glow transition-all duration-500 border-2 border-primary/20">
                <img 
                  src={heroImage} 
                  alt="Modern financial planning visualization with growth charts and analytics" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 grid grid-cols-3 gap-3 lg:hidden">
                <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-card text-center border">
                  <div className="text-xl font-bold text-primary">10K+</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
                <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-card text-center border">
                  <div className="text-xl font-bold text-secondary">50K+</div>
                  <div className="text-xs text-muted-foreground">Decisions</div>
                </div>
                <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-card text-center border">
                  <div className="text-xl font-bold text-accent">98%</div>
                  <div className="text-xs text-muted-foreground">Satisfied</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 sm:py-16">
        {!user ? (
          /* Guest Experience */
          <div className="space-y-12">
            {/* Social Proof */}
            <div className="text-center py-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="flex flex-col items-center gap-3 p-6 rounded-xl gradient-card border shadow-card hover:shadow-elevated transition-all">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-glow">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 rounded-xl gradient-card border shadow-card hover:shadow-elevated transition-all">
                  <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center shadow-glow">
                    <BarChart3 className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50,000+</div>
                    <div className="text-sm text-muted-foreground">Decisions Analyzed</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 rounded-xl gradient-card border shadow-card hover:shadow-elevated transition-all">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-glow">
                    <Shield className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Bank-Level</div>
                    <div className="text-sm text-muted-foreground">Security</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign Up CTA */}
            <Card className="max-w-3xl mx-auto border-2 border-primary/30 shadow-elevated hover:shadow-glow transition-all duration-300 gradient-card">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Get Started Today
                </CardTitle>
                <CardDescription className="text-base">
                  Sign up to save your budget data, access premium AI features, and track your financial progress over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                      <DollarSign className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold mb-2">Budget Tracking</h4>
                    <p className="text-sm text-muted-foreground">Save and track your financial data securely</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all">
                    <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3 shadow-glow">
                      <Target className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h4 className="font-semibold mb-2">Decision History</h4>
                    <p className="text-sm text-muted-foreground">Track all your financial decisions</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/20 hover:border-accent/40 transition-all">
                    <div className="w-12 h-12 gradient-premium rounded-full flex items-center justify-center mx-auto mb-3 shadow-premium">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">AI Advisor</h4>
                    <p className="text-sm text-muted-foreground">Get personalized financial advice</p>
                  </div>
                </div>
                <Button asChild className="w-full gradient-primary text-primary-foreground font-semibold shadow-glow" size="lg">
                  <a href="/auth">Sign Up Free - No Credit Card Required</a>
                </Button>
              </CardContent>
            </Card>

            {/* Demo Form */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 space-y-3">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Try the Calculator
                </h3>
                <p className="text-muted-foreground text-lg">Experience our financial analysis tool - no account required</p>
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
          /* Authenticated User Experience */
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {loadingBudget ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading your budget...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="space-y-6">
              {/* Premium Features */}
              {userProfile?.subscription_tier === 'premium' ? (
                <AIChat budgetData={budget} />
              ) : (
                <PremiumUpgrade onUpgrade={handlePremiumUpgrade} />
              )}

              {/* How It Works */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Enter Your Budget</h4>
                      <p className="text-xs text-muted-foreground">Your data is securely saved for future use</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Analyze Decisions</h4>
                      <p className="text-xs text-muted-foreground">Get instant affordability insights</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Get AI Advice</h4>
                      <p className="text-xs text-muted-foreground">Chat with AI for personalized guidance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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