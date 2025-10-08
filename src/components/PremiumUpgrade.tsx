import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, MessageCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PremiumUpgradeProps {
  onUpgrade?: () => void;
}

export default function PremiumUpgrade({ onUpgrade }: PremiumUpgradeProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    navigate('/under-construction');
  };

  const features = [
    {
      icon: MessageCircle,
      title: "AI Financial Advisor",
      description: "Chat with our AI for personalized financial advice"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Detailed financial projections and trend analysis"
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Get help when you need it most"
    },
    {
      icon: Zap,
      title: "Unlimited Decisions",
      description: "Analyze as many financial decisions as you want"
    }
  ];

  return (
    <Card className="border-2 border-gradient-to-r from-yellow-400 to-orange-500">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">
            <Crown className="w-4 h-4 mr-1" />
            Premium
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold">Upgrade to Premium</CardTitle>
        <CardDescription className="text-lg">
          Get personalized AI financial advice and advanced features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold">$9.99<span className="text-sm text-muted-foreground">/month</span></div>
          <p className="text-sm text-muted-foreground">Cancel anytime</p>
        </div>
        
        <Button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Premium
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          * Demo mode: Click to simulate premium upgrade
        </p>
      </CardContent>
    </Card>
  );
}