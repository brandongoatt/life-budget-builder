import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Car, GraduationCap, MapPin } from "lucide-react";

interface BudgetData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  emergencyFund: number;
}

interface DecisionCalculatorProps {
  budget: BudgetData;
}

type DecisionType = "rent" | "car" | "education" | "moving";

interface DecisionData {
  type: DecisionType;
  amount: number;
  monthlyPayment?: number;
  duration?: number;
}

export const DecisionCalculator = ({ budget }: DecisionCalculatorProps) => {
  const [selectedDecision, setSelectedDecision] = useState<DecisionType>("rent");
  const [amount, setAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<any>(null);

  const decisionTypes = [
    { value: "rent", label: "Rent/Housing", icon: Home },
    { value: "car", label: "Car Purchase", icon: Car },
    { value: "education", label: "Education", icon: GraduationCap },
    { value: "moving", label: "Moving Cities", icon: MapPin },
  ];

  const calculateImpact = () => {
    const disposableIncome = budget.monthlyIncome - budget.monthlyExpenses;
    const amountNum = parseFloat(amount) || 0;
    const monthlyNum = parseFloat(monthlyPayment) || 0;
    const durationNum = parseFloat(duration) || 1;

    let analysis = {
      affordability: "unknown",
      impact: "",
      recommendation: "",
      monthlyImpact: 0,
      savingsImpact: 0,
    };

    if (selectedDecision === "rent") {
      analysis.monthlyImpact = amountNum;
      analysis.savingsImpact = (disposableIncome - amountNum) * 12;
      
      if (amountNum <= disposableIncome * 0.3) {
        analysis.affordability = "good";
        analysis.impact = "Low impact on your budget";
        analysis.recommendation = "This housing cost is within recommended limits (30% of income).";
      } else if (amountNum <= disposableIncome * 0.5) {
        analysis.affordability = "caution";
        analysis.impact = "Moderate impact on your budget";
        analysis.recommendation = "This will stretch your budget. Consider if the location/amenities justify the cost.";
      } else {
        analysis.affordability = "high-risk";
        analysis.impact = "High impact on your budget";
        analysis.recommendation = "This housing cost is too high for your current income. Look for alternatives.";
      }
    } else if (selectedDecision === "car") {
      analysis.monthlyImpact = monthlyNum;
      analysis.savingsImpact = (disposableIncome - monthlyNum) * 12;
      
      if (monthlyNum <= disposableIncome * 0.15) {
        analysis.affordability = "good";
        analysis.impact = "Manageable monthly payment";
        analysis.recommendation = "This car payment fits well within your budget.";
      } else if (monthlyNum <= disposableIncome * 0.25) {
        analysis.affordability = "caution";
        analysis.impact = "Notable monthly commitment";
        analysis.recommendation = "Consider if you need all the features or if a less expensive option would work.";
      } else {
        analysis.affordability = "high-risk";
        analysis.impact = "Heavy monthly burden";
        analysis.recommendation = "This payment is too high. Consider used cars or public transportation.";
      }
    }

    setResult(analysis);
  };

  const getAffordabilityColor = (affordability: string) => {
    switch (affordability) {
      case "good": return "text-success";
      case "caution": return "text-warning";
      case "high-risk": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Life Decision Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="decision-type">Decision Type</Label>
          <Select value={selectedDecision} onValueChange={(value) => setSelectedDecision(value as DecisionType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {decisionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {selectedDecision === "rent" && (
          <div className="space-y-2">
            <Label htmlFor="rent-amount">Monthly Rent</Label>
            <Input
              id="rent-amount"
              type="number"
              placeholder="Enter monthly rent amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        )}

        {selectedDecision === "car" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="car-price">Car Price</Label>
              <Input
                id="car-price"
                type="number"
                placeholder="Enter car price"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-payment">Monthly Payment</Label>
              <Input
                id="monthly-payment"
                type="number"
                placeholder="Enter monthly payment"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
              />
            </div>
          </>
        )}

        {selectedDecision === "education" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="education-cost">Total Program Cost</Label>
              <Input
                id="education-cost"
                type="number"
                placeholder="Enter total cost"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-duration">Duration (years)</Label>
              <Input
                id="program-duration"
                type="number"
                placeholder="Enter duration in years"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </>
        )}

        {selectedDecision === "moving" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="moving-cost">Moving Costs</Label>
              <Input
                id="moving-cost"
                type="number"
                placeholder="Enter total moving costs"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-rent">New Monthly Rent</Label>
              <Input
                id="new-rent"
                type="number"
                placeholder="Enter new monthly rent"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
              />
            </div>
          </>
        )}

        <Button onClick={calculateImpact} className="w-full gradient-primary">
          Calculate Impact
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-muted rounded-lg space-y-3">
            <h4 className="font-semibold">Impact Analysis</h4>
            <div className={`text-lg font-medium ${getAffordabilityColor(result.affordability)}`}>
              {result.impact}
            </div>
            <p className="text-sm text-muted-foreground">
              {result.recommendation}
            </p>
            {result.monthlyImpact > 0 && (
              <div className="text-sm">
                <p><strong>Monthly Budget Impact:</strong> ${result.monthlyImpact.toLocaleString()}</p>
                <p><strong>Annual Savings Impact:</strong> ${result.savingsImpact.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};