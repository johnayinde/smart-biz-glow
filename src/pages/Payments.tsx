
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock payment data
const mockPayments = [
  {
    id: "1",
    date: "2023-03-05",
    amount: 2750,
    status: "completed",
    method: "Credit Card",
    client: "Acme Corporation",
    invoice: "INV-001"
  },
  {
    id: "2",
    date: "2023-03-20",
    amount: 1500,
    status: "completed",
    method: "Bank Transfer",
    client: "Wayne Enterprises",
    invoice: "INV-004"
  },
  {
    id: "3",
    date: "2023-04-01",
    amount: 3850,
    status: "pending",
    method: "Credit Card",
    client: "Stark Innovations",
    invoice: "INV-003"
  }
];

type PaymentMethod = "stripe" | "paystack" | "bank_transfer";

const Payments = () => {
  const [activeTab, setActiveTab] = useState<"history" | "settings">("history");
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod>("stripe");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Tabs defaultValue="history" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                View and manage all your received payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Invoice</th>
                      <th className="py-3 px-4 text-left">Client</th>
                      <th className="py-3 px-4 text-left">Method</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPayments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="py-3 px-4">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-medium">{payment.invoice}</td>
                        <td className="py-3 px-4">{payment.client}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                            {payment.method}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                            }`}
                          >
                            {payment.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className={activePaymentMethod === "stripe" ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Stripe</CardTitle>
                  {activePaymentMethod === "stripe" && (
                    <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Active
                    </span>
                  )}
                </div>
                <CardDescription>
                  Accept credit card payments online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Integration status: {activePaymentMethod === "stripe" ? "Connected" : "Not connected"}
                </p>
                <Button 
                  variant={activePaymentMethod === "stripe" ? "outline" : "default"}
                  className="w-full"
                  onClick={() => setActivePaymentMethod("stripe")}
                >
                  {activePaymentMethod === "stripe" ? "Manage" : "Connect"}
                </Button>
              </CardContent>
            </Card>
            
            <Card className={activePaymentMethod === "paystack" ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Paystack</CardTitle>
                  {activePaymentMethod === "paystack" && (
                    <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Active
                    </span>
                  )}
                </div>
                <CardDescription>
                  Accept payments in multiple currencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Integration status: {activePaymentMethod === "paystack" ? "Connected" : "Not connected"}
                </p>
                <Button 
                  variant={activePaymentMethod === "paystack" ? "outline" : "default"}
                  className="w-full"
                  onClick={() => setActivePaymentMethod("paystack")}
                >
                  {activePaymentMethod === "paystack" ? "Manage" : "Connect"}
                </Button>
              </CardContent>
            </Card>
            
            <Card className={activePaymentMethod === "bank_transfer" ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Bank Transfer</CardTitle>
                  {activePaymentMethod === "bank_transfer" && (
                    <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      Active
                    </span>
                  )}
                </div>
                <CardDescription>
                  Manage manual bank transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Status: {activePaymentMethod === "bank_transfer" ? "Enabled" : "Disabled"}
                </p>
                <Button 
                  variant={activePaymentMethod === "bank_transfer" ? "outline" : "default"}
                  className="w-full"
                  onClick={() => setActivePaymentMethod("bank_transfer")}
                >
                  {activePaymentMethod === "bank_transfer" ? "Manage" : "Enable"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
