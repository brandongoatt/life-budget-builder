import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Target, AlertTriangle } from "lucide-react";

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

  const getHealthStatus = () => {
    if (savingsRate < 10) return { color: "text-destructive", status: "Needs Attention" };
    if (savingsRate < 20) return { color: "text-warning", status: "Fair" };
    return { color: "text-success", status: "Healthy" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${budget.monthlyIncome.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disposable Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${disposableIncome.toLocaleString()}</div>
          <p className={`text-xs ${healthStatus.color}`}>
            {savingsRate.toFixed(1)}% savings rate
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Emergency Fund</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${budget.emergencyFund.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {emergencyMonths.toFixed(1)} months coverage
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${healthStatus.color}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${healthStatus.color}`}>
            {healthStatus.status}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};