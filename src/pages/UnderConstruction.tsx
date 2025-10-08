import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-background" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <Card className="max-w-md w-full relative z-10 shadow-elevated hover:shadow-glow transition-all duration-500 gradient-card border-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse">
              <Construction className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Under Construction
          </CardTitle>
          <CardDescription className="text-base font-medium">
            This feature is currently being developed
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-center text-foreground/90 font-medium">
              We're working hard to bring you this feature. You'll be contacted when it's ready, 
              and you'll have <span className="text-primary font-bold">priority access</span>!
            </p>
          </div>
          
          <Button 
            onClick={() => navigate(-1)} 
            className="w-full gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-glow"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
