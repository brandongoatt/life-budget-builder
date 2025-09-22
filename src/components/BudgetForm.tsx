import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  emergencyFund: number;
}

interface BudgetFormProps {
  onBudgetUpdate: (budget: BudgetData) => void;
  initialBudget?: BudgetData;
}

export const BudgetForm = ({ onBudgetUpdate, initialBudget }: BudgetFormProps) => {
  const [income, setIncome] = useState(initialBudget?.monthlyIncome?.toString() || "");
  const [expenses, setExpenses] = useState(initialBudget?.monthlyExpenses?.toString() || "");
  const [savings, setSavings] = useState(initialBudget?.savings?.toString() || "");
  const [emergencyFund, setEmergencyFund] = useState(initialBudget?.emergencyFund?.toString() || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateInputs = () => {
    const incomeNum = parseFloat(income) || 0;
    const expensesNum = parseFloat(expenses) || 0;
    
    if (incomeNum <= 0) {
      toast({
        title: "Invalid Income",
        description: "Please enter a valid monthly income greater than 0.",
        variant: "destructive",
      });
      return false;
    }
    
    if (expensesNum < 0) {
      toast({
        title: "Invalid Expenses",
        description: "Monthly expenses cannot be negative.",
        variant: "destructive",
      });
      return false;
    }
    
    if (expensesNum >= incomeNum) {
      toast({
        title: "Budget Warning",
        description: "Your expenses are equal to or exceed your income. Consider reviewing your budget.",
        variant: "destructive",
      });
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setIsLoading(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const budget: BudgetData = {
      monthlyIncome: parseFloat(income) || 0,
      monthlyExpenses: parseFloat(expenses) || 0,
      savings: parseFloat(savings) || 0,
      emergencyFund: parseFloat(emergencyFund) || 0,
    };

    onBudgetUpdate(budget);
    
    toast({
      title: "Budget Updated",
      description: "Your budget information has been successfully updated.",
    });
    
    setIsLoading(false);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return num.toLocaleString();
  };

  return (
    <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          Enter Your Budget Information
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Provide your financial details to get personalized insights for your life decisions.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Income Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Income & Expenses
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income" className="text-sm font-medium">
                    Monthly Income *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="income"
                      type="number"
                      placeholder="5,000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="pl-8 h-12"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {income && (
                    <p className="text-xs text-muted-foreground">
                      ${formatCurrency(income)} per month
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenses" className="text-sm font-medium">
                    Monthly Expenses *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="3,500"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                      className="pl-8 h-12"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {expenses && (
                    <p className="text-xs text-muted-foreground">
                      ${formatCurrency(expenses)} per month
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Savings Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Current Financial Position
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="savings" className="text-sm font-medium">
                    Total Savings
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="savings"
                      type="number"
                      placeholder="10,000"
                      value={savings}
                      onChange={(e) => setSavings(e.target.value)}
                      className="pl-8 h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {savings && (
                    <p className="text-xs text-muted-foreground">
                      ${formatCurrency(savings)} in savings
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-fund" className="text-sm font-medium">
                    Emergency Fund
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="emergency-fund"
                      type="number"
                      placeholder="15,000"
                      value={emergencyFund}
                      onChange={(e) => setEmergencyFund(e.target.value)}
                      className="pl-8 h-12"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {emergencyFund && (
                    <p className="text-xs text-muted-foreground">
                      ${formatCurrency(emergencyFund)} emergency fund
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 gradient-primary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Analyze My Budget
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};