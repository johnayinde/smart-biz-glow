import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, DollarSign, Download, Eye, FileText, AlertTriangle, Clock, Send } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { invoices } from "@/services/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Mock payment data
const mockPayments = [
  {
    id: "1",
    date: "2023-03-05",
    amount: 2750,
    status: "completed",
    method: "Credit Card",
    client: "Acme Corporation",
    invoice: "INV-001",
    cardLast4: "4242",
    cardType: "Visa",
    reference: "REF-2023-001",
    description: "Monthly subscription payment"
  },
  {
    id: "2",
    date: "2023-03-20",
    amount: 1500,
    status: "completed",
    method: "Bank Transfer",
    client: "Wayne Enterprises",
    invoice: "INV-004",
    accountName: "Wayne Enterprises Inc.",
    accountNumber: "XXXX-9876",
    reference: "REF-2023-002",
    description: "Website development services"
  },
  {
    id: "3",
    date: "2023-04-01",
    amount: 3850,
    status: "pending",
    method: "Credit Card",
    client: "Stark Innovations",
    invoice: "INV-003",
    cardLast4: "1234",
    cardType: "Mastercard",
    reference: "REF-2023-003",
    description: "Consulting services for Q1"
  }
];

type PaymentMethod = "stripe" | "paystack" | "bank_transfer";

const Payments = () => {
  const [activeTab, setActiveTab] = useState<"history" | "unpaid" | "settings">("history");
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod>("stripe");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);

  // Get unpaid invoices (pending and overdue)
  const unpaidInvoices = invoices.filter(invoice => 
    invoice.status === 'pending' || invoice.status === 'overdue'
  );

  const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue');
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending');

  const handleViewPaymentDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  const handleDownloadReceipt = (paymentId: string) => {
    // In a real app, this would generate and download a PDF receipt
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for payment #${paymentId} has been downloaded.`,
    });
  };

  const handleRecordPayment = () => {
    setIsNewPaymentOpen(true);
  };

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder has been sent for invoice #${invoiceId}.`,
    });
  };

  const handleConnectStripe = () => {
    toast({
      title: "Stripe Integration",
      description: "This would connect to Stripe. Integration requires API keys and backend setup.",
    });
  };

  const handleConnectPaystack = () => {
    toast({
      title: "Paystack Integration", 
      description: "This would connect to Paystack. Integration requires API keys and backend setup.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <Button onClick={handleRecordPayment}>
          <DollarSign className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Tabs defaultValue="unpaid" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="unpaid">
            Unpaid Invoices
            {unpaidInvoices.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unpaidInvoices.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unpaid" className="space-y-4">
          {overdueInvoices.length > 0 && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Overdue Invoices ({overdueInvoices.length})
                </CardTitle>
                <CardDescription>
                  These invoices are past their due date and require immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="py-3 px-4 text-left">Invoice</th>
                        <th className="py-3 px-4 text-left">Client</th>
                        <th className="py-3 px-4 text-left">Due Date</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Days Overdue</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueInvoices.map((invoice) => {
                        const daysOverdue = Math.ceil((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 3600 * 24));
                        return (
                          <tr key={invoice.id} className="border-b">
                            <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                            <td className="py-3 px-4">{invoice.clientName}</td>
                            <td className="py-3 px-4">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              ${invoice.total.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant="destructive">{daysOverdue} days</Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSendReminder(invoice.invoiceNumber)}
                                >
                                  <Send className="mr-1 h-3 w-3" />
                                  Send Reminder
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View Invoice"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {pendingInvoices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-orange-500" />
                  Pending Invoices ({pendingInvoices.length})
                </CardTitle>
                <CardDescription>
                  These invoices are awaiting payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="py-3 px-4 text-left">Invoice</th>
                        <th className="py-3 px-4 text-left">Client</th>
                        <th className="py-3 px-4 text-left">Due Date</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Days Until Due</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingInvoices.map((invoice) => {
                        const daysUntilDue = Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                          <tr key={invoice.id} className="border-b">
                            <td className="py-3 px-4 font-medium">{invoice.invoiceNumber}</td>
                            <td className="py-3 px-4">{invoice.clientName}</td>
                            <td className="py-3 px-4">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right font-medium">
                              ${invoice.total.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={daysUntilDue <= 3 ? "destructive" : "secondary"}>
                                {daysUntilDue > 0 ? `${daysUntilDue} days` : "Due today"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex justify-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSendReminder(invoice.invoiceNumber)}
                                >
                                  <Send className="mr-1 h-3 w-3" />
                                  Send Reminder
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  title="View Invoice"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {unpaidInvoices.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any unpaid invoices at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
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
                      <th className="py-3 px-4 text-center">Actions</th>
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
                                ? "bg-status-paid-bg text-invoice-paid-foreground"
                                : "bg-status-pending-bg text-invoice-pending-foreground"
                            }`}
                          >
                            {payment.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewPaymentDetails(payment)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {payment.status === "completed" && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDownloadReceipt(payment.id)}
                                title="Download Receipt"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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
                  Accept payments across Africa
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
                  Receive direct bank transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Integration status: {activePaymentMethod === "bank_transfer" ? "Connected" : "Not connected"}
                </p>
                <Button 
                  variant={activePaymentMethod === "bank_transfer" ? "outline" : "default"}
                  className="w-full"
                  onClick={() => setActivePaymentMethod("bank_transfer")}
                >
                  {activePaymentMethod === "bank_transfer" ? "Manage" : "Setup"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Payment information for {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <p className="text-lg font-semibold">${selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <p className={`capitalize ${selectedPayment.status === 'completed' ? 'text-invoice-paid' : 'text-invoice-pending'}`}>
                    {selectedPayment.status}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                  <p>{new Date(selectedPayment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Method</Label>
                  <p>{selectedPayment.method}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                <p>{selectedPayment.client}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Invoice</Label>
                <p>{selectedPayment.invoice}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Reference</Label>
                <p className="font-mono text-sm">{selectedPayment.reference}</p>
              </div>
              
              {selectedPayment.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p>{selectedPayment.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Record New Payment Sheet */}
      <Sheet open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Record New Payment</SheetTitle>
            <SheetDescription>
              Record a payment that you received outside of the integrated payment systems.
            </SheetDescription>
          </SheetHeader>
          <RecordPaymentForm onClose={() => setIsNewPaymentOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Record Payment Form Component
const RecordPaymentForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    client: "",
    invoice: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    method: "",
    reference: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Payment Recorded",
      description: `Payment of $${formData.amount} has been recorded successfully.`,
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select value={formData.client} onValueChange={(value) => handleInputChange("client", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acme">Acme Corporation</SelectItem>
              <SelectItem value="wayne">Wayne Enterprises</SelectItem>
              <SelectItem value="stark">Stark Innovations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="invoice">Invoice</Label>
          <Select value={formData.invoice} onValueChange={(value) => handleInputChange("invoice", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select invoice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inv-001">INV-001</SelectItem>
              <SelectItem value="inv-002">INV-002</SelectItem>
              <SelectItem value="inv-003">INV-003</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Payment Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select value={formData.method} onValueChange={(value) => handleInputChange("method", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference">Reference Number</Label>
        <Input
          id="reference"
          placeholder="Transaction reference or check number"
          value={formData.reference}
          onChange={(e) => handleInputChange("reference", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Additional payment details..."
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Record Payment
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default Payments;