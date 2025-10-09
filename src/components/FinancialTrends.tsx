import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target, PiggyBank } from "lucide-react";

interface BudgetData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  emergencyFund: number;
}

interface FinancialTrendsProps {
  budget: BudgetData;
  isPremium: boolean;
}

export const FinancialTrends = ({ budget, isPremium }: FinancialTrendsProps) => {
  const disposableIncome = budget.monthlyIncome - budget.monthlyExpenses;
  const savingsRate = budget.monthlyIncome > 0 ? (disposableIncome / budget.monthlyIncome) * 100 : 0;
  const emergencyMonths = budget.monthlyExpenses > 0 ? budget.emergencyFund / budget.monthlyExpenses : 0;
  
  // Projected values
  const projectedAnnualSavings = disposableIncome * 12;
  const projectedSavingsIn6Months = budget.savings + (disposableIncome * 6);
  const monthsToTarget = emergencyMonths < 6 ? Math.ceil((budget.monthlyExpenses * 6 - budget.emergencyFund) / Math.max(disposableIncome, 1)) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Financial Trends</h2>
        <p className="text-muted-foreground">
          Track your financial progress and projections
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Velocity</CardTitle>
            {savingsRate >= 20 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-warning" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {savingsRate >= 20 ? 'Excellent progress!' : savingsRate >= 10 ? 'Good progress' : 'Consider increasing'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Projection</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(projectedAnnualSavings)}</div>
            <p className="text-xs text-muted-foreground">
              Estimated savings this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projections */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            6-Month Projection
          </CardTitle>
          <CardDescription>
            Your estimated financial position in 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Total Savings</span>
              <span className="font-semibold">{formatCurrency(budget.savings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Projected in 6 Months</span>
              <span className="font-semibold text-success">{formatCurrency(projectedSavingsIn6Months)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Potential Growth</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-semibold text-success">
                  {formatCurrency(projectedSavingsIn6Months - budget.savings)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Fund Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            Emergency Fund Goal
          </CardTitle>
          <CardDescription>
            Track progress toward 6 months of expenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Coverage</span>
              <span className="font-semibold">{emergencyMonths.toFixed(1)} months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Target Goal</span>
              <span className="font-semibold">6.0 months</span>
            </div>
            {monthsToTarget > 0 && disposableIncome > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Months to Goal</span>
                <Badge variant="outline">~{monthsToTarget} months</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Premium Unlock Teaser */}
      {!isPremium && (
        <Card className="shadow-card border-2 border-dashed border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              Advanced Analytics
              <Badge className="ml-2">Premium</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Unlock advanced features including:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Month-over-month comparison charts</li>
              <li>• Spending category breakdown</li>
              <li>• Custom financial goal tracking</li>
              <li>• Predictive AI insights</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
