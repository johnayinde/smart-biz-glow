import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Crown, Star, Zap, CreditCard, Settings } from "lucide-react";

const currentPlan = {
  name: "Professional",
  price: 29,
  period: "month",
  status: "active",
  nextBilling: "2024-02-15",
  usage: {
    invoices: { current: 45, limit: 100 },
    clients: { current: 12, limit: 50 },
    storage: { current: 2.3, limit: 10 }, // GB
  }
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    period: "month",
    description: "Perfect for freelancers and small businesses",
    features: [
      "Up to 25 invoices per month",
      "Up to 10 clients",
      "Basic templates",
      "Email support",
      "1GB storage",
    ],
    limits: {
      invoices: 25,
      clients: 10,
      storage: 1,
    },
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 29,
    period: "month",
    description: "Ideal for growing businesses",
    features: [
      "Up to 100 invoices per month",
      "Up to 50 clients",
      "Advanced templates",
      "Priority support",
      "10GB storage",
      "Payment tracking",
      "Basic analytics",
    ],
    limits: {
      invoices: 100,
      clients: 50,
      storage: 10,
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For large businesses with advanced needs",
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "Custom templates",
      "Phone + email support",
      "100GB storage",
      "Advanced analytics",
      "Multi-user access",
      "API access",
      "White-label options",
    ],
    limits: {
      invoices: -1, // unlimited
      clients: -1,
      storage: 100,
    },
    popular: false,
  },
];

export default function Subscription() {
  const currentPlanData = plans.find(p => p.name.toLowerCase() === currentPlan.name.toLowerCase());

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing preferences.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Current Plan: {currentPlan.name}
          </CardTitle>
          <CardDescription>
            Your current subscription status and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                ${currentPlan.price}/{currentPlan.period}
              </div>
              <div className="text-sm text-muted-foreground">
                Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString()}
              </div>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              {currentPlan.status}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Invoices</span>
                <span>{currentPlan.usage.invoices.current}/{currentPlan.usage.invoices.limit}</span>
              </div>
              <Progress 
                value={(currentPlan.usage.invoices.current / currentPlan.usage.invoices.limit) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clients</span>
                <span>{currentPlan.usage.clients.current}/{currentPlan.usage.clients.limit}</span>
              </div>
              <Progress 
                value={(currentPlan.usage.clients.current / currentPlan.usage.clients.limit) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>{currentPlan.usage.storage.current}GB/{currentPlan.usage.storage.limit}GB</span>
              </div>
              <Progress 
                value={(currentPlan.usage.storage.current / currentPlan.usage.storage.limit) * 100} 
                className="h-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing History
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.name}
                  {plan.name.toLowerCase() === currentPlan.name.toLowerCase() && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-base font-normal text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.name.toLowerCase() === currentPlan.name.toLowerCase() ? "secondary" : "default"}
                  disabled={plan.name.toLowerCase() === currentPlan.name.toLowerCase()}
                >
                  {plan.name.toLowerCase() === currentPlan.name.toLowerCase() ? (
                    "Current Plan"
                  ) : plan.price > currentPlan.price ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade
                    </>
                  ) : (
                    "Downgrade"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your payment method and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CreditCard className="h-5 w-5" />
                <div>
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/25</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Billing Address</h3>
              <div className="p-3 border rounded-lg">
                <div className="text-sm">
                  123 Business Street<br />
                  Suite 100<br />
                  New York, NY 10001<br />
                  United States
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline">Update Payment Method</Button>
            <Button variant="outline">Update Billing Address</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}