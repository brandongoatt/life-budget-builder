import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Target, AlertTriangle, PiggyBank, Shield } from "lucide-react";

interface BudgetData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  emergencyFund: number;
}

interface BudgetOverviewProps {
  budget: BudgetData;
}

export const BudgetOverview = ({ budget }: BudgetOverviewProps) => {
  const disposableIncome = budget.monthlyIncome - budget.monthlyExpenses;
  const savingsRate = budget.monthlyIncome > 0 ? (disposableIncome / budget.monthlyIncome) * 100 : 0;
  const emergencyMonths = budget.monthlyExpenses > 0 ? budget.emergencyFund / budget.monthlyExpenses : 0;
  const expenseRatio = budget.monthlyIncome > 0 ? (budget.monthlyExpenses / budget.monthlyIncome) * 100 : 0;

  // Get thresholds from localStorage
  const savingsThreshold = parseInt(localStorage.getItem('savingsThreshold') || '20');
  const expenseThreshold = parseInt(localStorage.getItem('expenseThreshold') || '80');

  const getHealthStatus = () => {
    let score = 0;
    if (savingsRate >= savingsThreshold) score += 3;
    else if (savingsRate >= savingsThreshold / 2) score += 2;
    else if (savingsRate >= savingsThreshold / 4) score += 1;
    
    if (emergencyMonths >= 6) score += 3;
    else if (emergencyMonths >= 3) score += 2;
    else if (emergencyMonths >= 1) score += 1;
    
    if (expenseRatio <= expenseThreshold - 10) score += 2;
    else if (expenseRatio <= expenseThreshold) score += 1;

    if (score >= 7) return { color: "text-success", status: "Excellent", bgColor: "bg-success/10" };
    if (score >= 5) return { color: "text-primary", status: "Good", bgColor: "bg-primary/10" };
    if (score >= 3) return { color: "text-warning", status: "Fair", bgColor: "bg-warning/10" };
    return { color: "text-destructive", status: "Needs Attention", bgColor: "bg-destructive/10" };
  };

  const healthStatus = getHealthStatus();

  const getSavingsRateColor = () => {
    if (savingsRate >= savingsThreshold) return "text-success";
    if (savingsRate >= savingsThreshold / 2) return "text-primary";
    if (savingsRate >= savingsThreshold / 4) return "text-warning";
    return "text-destructive";
  };

  const getEmergencyFundColor = () => {
    if (emergencyMonths >= 6) return "text-success";
    if (emergencyMonths >= 3) return "text-primary";
    if (emergencyMonths >= 1) return "text-warning";
    return "text-destructive";
  };

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
      {/* Financial Health Summary */}
      <Card className={`shadow-card border-0 ${healthStatus.bgColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Financial Health Score</h3>
              <div className={`text-3xl font-bold ${healthStatus.color}`}>
                {healthStatus.status}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your savings rate, emergency fund, and expense ratio
              </p>
            </div>
            <div className={`p-4 rounded-full ${healthStatus.bgColor}`}>
              <AlertTriangle className={`h-8 w-8 ${healthStatus.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(budget.monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total monthly earnings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(disposableIncome)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Progress value={Math.min(savingsRate, 100)} className="flex-1 h-2" />
              <span className={`text-xs font-medium ${getSavingsRateColor()}`}>
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Savings rate after expenses
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Fund</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(budget.emergencyFund)}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Progress value={Math.min((emergencyMonths / 6) * 100, 100)} className="flex-1 h-2" />
              <span className={`text-xs font-medium ${getEmergencyFundColor()}`}>
                {emergencyMonths.toFixed(1)}m
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Months of expenses covered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PiggyBank className="h-5 w-5 text-primary" />
              Savings Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Savings</span>
                <span className="font-medium">{formatCurrency(budget.savings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Monthly Savings Potential</span>
                <span className={`font-medium ${disposableIncome > 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(Math.max(0, disposableIncome))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Annual Savings Potential</span>
                <span className={`font-medium ${disposableIncome > 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(Math.max(0, disposableIncome * 12))}
                </span>
              </div>
            </div>
            
            {savingsRate < savingsThreshold && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-warning-foreground">
                  <strong>Tip:</strong> Aim for a {savingsThreshold}% savings rate for optimal financial health.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Expenses</span>
                <span className="font-medium">{formatCurrency(budget.monthlyExpenses)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expense Ratio</span>
                <span className={`font-medium ${expenseRatio <= expenseThreshold - 10 ? 'text-success' : expenseRatio <= expenseThreshold ? 'text-warning' : 'text-destructive'}`}>
                  {expenseRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Your Maximum Threshold</span>
                <span className="font-medium text-muted-foreground">{expenseThreshold}%</span>
              </div>
            </div>
            
            {emergencyMonths < 3 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive-foreground">
                  <strong>Priority:</strong> Build an emergency fund covering 3-6 months of expenses.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};