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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Realistic Budgeting for Life Decisions</h1>
          <p className="text-muted-foreground">Make informed decisions about major life purchases</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Smart Financial Decisions for Life's
                <span className="text-primary"> Big Moments</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you're considering a new home, car, education, or major life change, 
                our calculator helps you understand the real impact on your budget and goals.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Housing Decisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>Vehicle Purchases</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Education Investment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>Location Changes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Family making financial decisions with budget planning" 
                className="w-full h-auto rounded-lg shadow-elevated"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
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
          <section className="py-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">How It Works</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get started by entering your budget information above, then use our calculators 
                to analyze major life decisions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card rounded-lg shadow-card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Enter Your Budget</h4>
                <p className="text-sm text-muted-foreground">
                  Input your income, expenses, and savings information
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg shadow-card">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Choose Decision Type</h4>
                <p className="text-sm text-muted-foreground">
                  Select housing, car, education, or moving decision
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg shadow-card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Get Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  See detailed impact on your budget and savings goals
                </p>
              </div>
              
              <div className="text-center p-6 bg-card rounded-lg shadow-card">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-warning font-bold">4</span>
                </div>
                <h4 className="font-semibold mb-2">Make Decision</h4>
                <p className="text-sm text-muted-foreground">
                  Use insights to make informed financial choices
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Realistic Budgeting for Life Decisions. Make smarter financial choices.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
