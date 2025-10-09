import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, Car, GraduationCap, MapPin, Calendar, DollarSign } from "lucide-react";

interface Decision {
  id: string;
  decision_type: string;
  decision_data: any;
  analysis_result: any;
  created_at: string;
}

export const DecisionHistory = () => {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecisions();
  }, [user]);

  const loadDecisions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setDecisions(data || []);
    } catch (error) {
      console.error('Error loading decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDecisionIcon = (type: string) => {
    switch (type) {
      case 'rent': return Home;
      case 'car': return Car;
      case 'education': return GraduationCap;
      case 'relocation': return MapPin;
      default: return DollarSign;
    }
  };

  const getDecisionLabel = (type: string) => {
    const labels: Record<string, string> = {
      rent: 'Housing & Rent',
      car: 'Car Purchase',
      education: 'Education',
      relocation: 'Relocation'
    };
    return labels[type] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Decision History</h2>
        <p className="text-muted-foreground">
          Review your past financial decisions and analyses
        </p>
      </div>

      {decisions.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No decisions yet. Start analyzing your financial choices!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {decisions.map((decision) => {
            const Icon = getDecisionIcon(decision.decision_type);
            const result = decision.analysis_result;
            
            return (
              <Card key={decision.id} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {getDecisionLabel(decision.decision_type)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(decision.created_at)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={result?.recommendation === 'affordable' ? 'default' : 'secondary'}>
                      {result?.recommendation || 'Analyzed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {decision.decision_data.amount && (
                      <div>
                        <span className="text-muted-foreground">Amount</span>
                        <p className="font-semibold">{formatCurrency(decision.decision_data.amount)}</p>
                      </div>
                    )}
                    {decision.decision_data.monthlyPayment && (
                      <div>
                        <span className="text-muted-foreground">Monthly Payment</span>
                        <p className="font-semibold">{formatCurrency(decision.decision_data.monthlyPayment)}</p>
                      </div>
                    )}
                    {result?.affordabilityScore && (
                      <div>
                        <span className="text-muted-foreground">Affordability Score</span>
                        <p className="font-semibold">{result.affordabilityScore}%</p>
                      </div>
                    )}
                    {result?.impact && (
                      <div>
                        <span className="text-muted-foreground">Budget Impact</span>
                        <p className="font-semibold">{formatCurrency(result.impact)}/mo</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
