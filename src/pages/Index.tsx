import { useState } from "react";
import { BudgetOverview } from "@/components/BudgetOverview";
import { BudgetForm } from "@/components/BudgetForm";
import { DecisionCalculator } from "@/components/DecisionCalculator";
import heroImage from "@/assets/hero-image.jpg";

interface BudgetData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  emergencyFund: number;
}

const Index = () => {
  const [budget, setBudget] = useState<BudgetData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0,
    emergencyFund: 0,
  });

  const [showCalculator, setShowCalculator] = useState(false);

  const handleBudgetUpdate = (newBudget: BudgetData) => {
    setBudget(newBudget);
    setShowCalculator(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">Smart Budget Decisions</h1>
              <p className="text-sm text-muted-foreground">Make informed decisions about major life purchases</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Real-time Analysis</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  Free Financial Analysis
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Make Smart Financial
                  <span className="text-primary"> Life Decisions</span>
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Get instant analysis on housing, cars, education, and relocation decisions. 
                  Understand the real impact on your budget with comprehensive risk assessment.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">Housing Analysis</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium">Vehicle Finance</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-sm font-medium">Education ROI</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-sm font-medium">Relocation Cost</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Risk Assessment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                  <span>Alternative Options</span>
                </div>
              </div>
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
      <main className="container mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Budget Overview */}
        {showCalculator && (
          <BudgetOverview budget={budget} />
        )}

        {/* Budget Form */}
        <BudgetForm 
          onBudgetUpdate={handleBudgetUpdate} 
          initialBudget={budget}
        />

        {/* Decision Calculator */}
        {showCalculator && (
          <DecisionCalculator budget={budget} />
        )}

        {/* Features Section */}
        {!showCalculator && (
          <section className="py-8 sm:py-12">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">How It Works</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Get comprehensive financial analysis in four simple steps. Make better decisions with data-driven insights.
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
              &copy; 2024 Smart Budget Decisions. Empowering informed financial choices.
            </p>
            <p className="text-xs text-muted-foreground">
              Free financial analysis tool for major life decisions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
