
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
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
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

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Transaction information for payment #{selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{selectedPayment.client}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPayment.invoice}</p>
                </div>
                <Badge variant={selectedPayment.status === "completed" ? "default" : "secondary"}>
                  {selectedPayment.status === "completed" ? "Completed" : "Pending"}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{format(new Date(selectedPayment.date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="font-medium">${selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p>{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reference</p>
                  <p>{selectedPayment.reference}</p>
                </div>
                {selectedPayment.cardLast4 && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Card Type</p>
                      <p>{selectedPayment.cardType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Card</p>
                      <p>**** **** **** {selectedPayment.cardLast4}</p>
                    </div>
                  </>
                )}
                {selectedPayment.accountNumber && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Name</p>
                      <p>{selectedPayment.accountName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                      <p>{selectedPayment.accountNumber}</p>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p>{selectedPayment.description}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                {selectedPayment.status === "completed" && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadReceipt(selectedPayment.id)}
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                )}
                <Button 
                  variant="default" 
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Record New Payment Sheet */}
      <Sheet open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Record New Payment</SheetTitle>
            <SheetDescription>
              Add details for a new payment received from a client
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-4">
            <RecordPaymentForm onClose={() => setIsNewPaymentOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Create the RecordPaymentForm component
const RecordPaymentForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    client: "",
    invoice: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
    method: "Credit Card",
    reference: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to your backend
    toast({
      title: "Payment Recorded",
      description: `Payment of $${formData.amount} from ${formData.client} has been recorded.`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="client" className="text-sm font-medium">Client</label>
        <input
          id="client"
          name="client"
          type="text"
          className="w-full rounded-md border border-input px-3 py-2"
          value={formData.client}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="invoice" className="text-sm font-medium">Invoice Number</label>
        <input
          id="invoice"
          name="invoice"
          type="text"
          className="w-full rounded-md border border-input px-3 py-2"
          value={formData.invoice}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          className="w-full rounded-md border border-input px-3 py-2"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">Payment Date</label>
        <input
          id="date"
          name="date"
          type="date"
          className="w-full rounded-md border border-input px-3 py-2"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="method" className="text-sm font-medium">Payment Method</label>
        <select
          id="method"
          name="method"
          className="w-full rounded-md border border-input px-3 py-2"
          value={formData.method}
          onChange={handleChange as any}
          required
        >
          <option>Credit Card</option>
          <option>Bank Transfer</option>
          <option>PayPal</option>
          <option>Cash</option>
          <option>Check</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="reference" className="text-sm font-medium">Reference Number</label>
        <input
          id="reference"
          name="reference"
          type="text"
          className="w-full rounded-md border border-input px-3 py-2"
          value={formData.reference}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          className="w-full rounded-md border border-input px-3 py-2"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="flex items-center"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>
    </form>
  );
};

export default Payments;
