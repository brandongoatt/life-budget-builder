import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, DollarSign, PiggyBank, Brain, Shield, LogIn, Users, BarChart3, Target, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Calculator,
      title: "Budget Analysis",
      description: "Comprehensive analysis of your financial health"
    },
    {
      icon: TrendingUp,
      title: "Smart Recommendations",
      description: "AI-powered insights for better decisions"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security for your data"
    },
    {
      icon: Brain,
      title: "AI Financial Advisor",
      description: "Personal AI assistant for financial guidance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">FinanceAI</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-purple-900"
              asChild
            >
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Smart Financial
              <span className="text-purple-400"> Decisions</span>
              <br />Made Simple
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Take control of your finances with AI-powered insights. Make informed decisions about budgeting, investments, and major purchases with personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4"
                asChild
              >
                <Link to="/auth">
                  Start Free Analysis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900 px-8 py-4">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Financial dashboard and analytics" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for Smart Financial Decisions
            </h2>
            <p className="text-xl text-gray-300">
              Comprehensive tools and AI-powered insights to guide your financial journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>10,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>50,000+ decisions analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Bank-level security</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose FinanceAI?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Budget Tracking</h4>
              <p className="text-gray-300">
                Save and track your financial data securely with automatic insights and recommendations.
              </p>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Decision History</h4>
              <p className="text-gray-300">
                Track all your financial decisions and see how they impact your overall financial health.
              </p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">AI Advisor</h4>
              <p className="text-gray-300">
                Get personalized advice from our AI financial advisor based on your unique situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already improved their financial health with AI-powered insights.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg"
            asChild
          >
            <Link to="/auth">
              Get Started Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 FinanceAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}