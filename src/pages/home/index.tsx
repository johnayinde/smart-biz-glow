import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, FileText, Users, Zap, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Invoicing",
      description: "Create professional invoices in seconds with customizable templates"
    },
    {
      icon: Users,
      title: "Client Management",
      description: "Organize and track all your clients in one centralized dashboard"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Get detailed reports on your business performance and trends"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Streamline your workflow with automated features and integrations"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay updated with instant notifications and real-time synchronization"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Professional Invoice Management
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Streamline Your</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Business Invoicing
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Create, send, and track professional invoices with ease. 
              Manage clients, analyze performance, and grow your business with our comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-base px-8 py-6">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you manage your business invoicing efficiently and professionally.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Business?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of business owners who have streamlined their invoicing process with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 py-6">
              <Link to="/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 py-6">
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;