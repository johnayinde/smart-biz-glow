
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const subscriptionPlans = [
  {
    name: "Basic",
    price: 9,
    priceId: "price_basic_test", // You'll need to replace with actual Stripe price IDs
    description: "Perfect for small businesses",
    features: [
      "Up to 10 invoices per month",
      "Basic templates",
      "Email support",
      "Basic analytics"
    ]
  },
  {
    name: "Premium",
    price: 19,
    priceId: "price_premium_test", // You'll need to replace with actual Stripe price IDs
    description: "Great for growing businesses",
    features: [
      "Up to 100 invoices per month",
      "All templates",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
      "Payment reminders"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: 49,
    priceId: "price_enterprise_test", // You'll need to replace with actual Stripe price IDs
    description: "For large organizations",
    features: [
      "Unlimited invoices",
      "Custom templates",
      "24/7 phone support",
      "Advanced reporting",
      "API access",
      "Multi-user accounts",
      "White-label solution"
    ]
  }
];

export default function Subscription() {
  const { subscriptionStatus, checkSubscription, createCheckout, openCustomerPortal, isAuthenticated } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      checkSubscription();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Check URL params for success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success === 'true') {
      toast({
        title: "Subscription successful!",
        description: "Your subscription has been activated. Please wait a moment for it to reflect.",
      });
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh subscription status
      setTimeout(() => checkSubscription(), 2000);
    } else if (canceled === 'true') {
      toast({
        title: "Subscription canceled",
        description: "Your subscription process was canceled.",
        variant: "destructive",
      });
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast, checkSubscription]);

  const handleRefreshSubscription = async () => {
    setIsRefreshing(true);
    try {
      await checkSubscription();
      toast({
        title: "Subscription status updated",
        description: "Your subscription information has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Failed to refresh",
        description: "Could not update subscription status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubscribe = async (priceId: string, planName: string) => {
    setIsLoading(true);
    try {
      const checkoutUrl = await createCheckout(priceId, planName);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const portalUrl = await openCustomerPortal();
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error("Failed to open customer portal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to view subscription options.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Select the perfect plan for your business needs
        </p>
        
        {subscriptionStatus && (
          <Card className="max-w-md mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Current Status:</span>
                <Badge variant={subscriptionStatus.subscribed ? "default" : "secondary"}>
                  {subscriptionStatus.subscribed ? "Active Subscription" : "No Subscription"}
                </Badge>
              </div>
              
              {subscriptionStatus.subscribed && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Plan:</span>
                    <span className="font-medium">{subscriptionStatus.subscription_tier}</span>
                  </div>
                  
                  {subscriptionStatus.subscription_end && (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Renews:</span>
                      <span className="text-sm">
                        {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshSubscription}
                  disabled={isRefreshing}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                {subscriptionStatus.subscribed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {subscriptionPlans.map((plan, index) => {
          const isCurrentPlan = subscriptionStatus?.subscribed && 
                               subscriptionStatus?.subscription_tier === plan.name;
          
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {index === 0 && <Zap className="h-5 w-5" />}
                  {index === 1 && <Crown className="h-5 w-5" />}
                  {index === 2 && <Star className="h-5 w-5" />}
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                {isCurrentPlan ? (
                  <Badge variant="secondary" className="w-full py-2 justify-center">
                    Current Plan
                  </Badge>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.priceId, plan.name)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : `Subscribe to ${plan.name}`}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          All plans include a 30-day money-back guarantee. Cancel anytime.
        </p>
        <p className="text-xs text-muted-foreground">
          Prices shown are in USD and exclude applicable taxes.
        </p>
      </div>
    </div>
  );
}
