import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budget: BudgetData = {
      monthlyIncome: parseFloat(income) || 0,
      monthlyExpenses: parseFloat(expenses) || 0,
      savings: parseFloat(savings) || 0,
      emergencyFund: parseFloat(emergencyFund) || 0,
    };

    onBudgetUpdate(budget);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Your Budget Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income</Label>
              <Input
                id="income"
                type="number"
                placeholder="Enter your monthly income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Monthly Expenses</Label>
              <Input
                id="expenses"
                type="number"
                placeholder="Enter your monthly expenses"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="savings">Current Savings</Label>
              <Input
                id="savings"
                type="number"
                placeholder="Enter your current savings"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency-fund">Emergency Fund</Label>
              <Input
                id="emergency-fund"
                type="number"
                placeholder="Enter your emergency fund"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary">
            Update Budget
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};