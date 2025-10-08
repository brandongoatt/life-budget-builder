import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Home, Car, GraduationCap, MapPin, Calculator, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  calculateRentImpact, 
  calculateCarImpact, 
  calculateEducationImpact, 
  calculateMovingImpact 
} from "@/components/DecisionHelpers";

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

interface AnalysisResult {
  affordability: "excellent" | "good" | "caution" | "high-risk";
  impact: string;
  recommendation: string;
  monthlyImpact: number;
  savingsImpact: number;
  timeToRecover?: number;
  alternatives?: string[];
  riskLevel: number;
}

export const DecisionCalculator = ({ budget }: DecisionCalculatorProps) => {
  const [selectedDecision, setSelectedDecision] = useState<DecisionType>("rent");
  const [amount, setAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [duration, setDuration] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const decisionTypes = [
    { value: "rent", label: "Housing & Rent", icon: Home, description: "Analyze rental costs and housing decisions" },
    { value: "car", label: "Vehicle Purchase", icon: Car, description: "Evaluate car loans and transportation costs" },
    { value: "education", label: "Education Investment", icon: GraduationCap, description: "Assess education costs and ROI" },
    { value: "moving", label: "Relocation", icon: MapPin, description: "Calculate moving and living cost changes" },
  ];

  const disposableIncome = budget.monthlyIncome - budget.monthlyExpenses;

  const calculateImpact = async () => {
    if (!amount && !monthlyPayment) {
      toast({
        title: "Missing Information",
        description: "Please enter the required financial details.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount) || 0;
    const monthlyNum = parseFloat(monthlyPayment) || 0;
    const durationNum = parseFloat(duration) || 1;
    const downPaymentNum = parseFloat(downPayment) || 0;

    let analysis: AnalysisResult = {
      affordability: "good",
      impact: "",
      recommendation: "",
      monthlyImpact: 0,
      savingsImpact: 0,
      riskLevel: 0,
    };

    if (selectedDecision === "rent") {
      analysis = calculateRentImpact(amountNum, disposableIncome, budget.monthlyIncome);
    } else if (selectedDecision === "car") {
      analysis = calculateCarImpact(amountNum, monthlyNum, downPaymentNum, disposableIncome, budget.savings);
    } else if (selectedDecision === "education") {
      analysis = calculateEducationImpact(amountNum, durationNum, disposableIncome, budget.savings);
    } else if (selectedDecision === "moving") {
      analysis = calculateMovingImpact(amountNum, monthlyNum, budget.monthlyExpenses, disposableIncome, budget.savings);
    }

    setResult(analysis);
    
    // Save decision to database if user is logged in
    if (user) {
      try {
        // Get active budget ID
        const { data: activeBudget } = await supabase
          .from('budgets')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (activeBudget) {
          const { error } = await supabase.from('decisions').insert([{
            user_id: user.id,
            budget_id: activeBudget.id,
            decision_type: selectedDecision,
            decision_data: {
              amount: amountNum,
              monthlyPayment: monthlyNum,
              duration: durationNum,
              downPayment: downPaymentNum
            },
            analysis_result: analysis as any
          }]);
          
          if (error) {
            console.error('Error saving decision:', error);
          }
        }
      } catch (error) {
        console.error('Error saving decision:', error);
      }
    }
    
    toast({
      title: "Analysis Complete",
      description: `Your ${decisionTypes.find(t => t.value === selectedDecision)?.label.toLowerCase()} analysis is ${user ? 'saved' : 'ready'}.`,
    });
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