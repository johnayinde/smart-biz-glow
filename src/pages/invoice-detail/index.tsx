import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Send, Edit, DollarSign, Calendar } from "lucide-react";

const mockInvoice = {
  id: "1",
  invoice_number: "INV-001",
  status: "sent" as const,
  issue_date: "2024-01-15",
  due_date: "2024-02-15",
  subtotal: 1000.00,
  tax_amount: 100.00,
  total: 1100.00,
  currency: "USD",
  notes: "Payment due within 30 days. Late payments may incur additional fees.",
  client: {
    id: "1",
    name: "Acme Corporation",
    email: "billing@acme.com",
  },
  items: [
    {
      id: "1",
      description: "Website Design",
      quantity: 1,
      rate: 500.00,
      amount: 500.00,
    },
    {
      id: "2",
      description: "Logo Design",
      quantity: 1,
      rate: 300.00,
      amount: 300.00,
    },
    {
      id: "3",
      description: "Business Card Design",
      quantity: 100,
      rate: 2.00,
      amount: 200.00,
    },
  ],
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
};

const statusColors = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
} as const;

export default function InvoiceDetail() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{mockInvoice.invoice_number}</h1>
          <p className="text-muted-foreground">Invoice details and status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {mockInvoice.status === 'sent' && (
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Invoice Details</CardTitle>
                  <CardDescription>
                    Invoice #{mockInvoice.invoice_number}
                  </CardDescription>
                </div>
                <Badge variant={statusColors[mockInvoice.status]}>
                  {mockInvoice.status.charAt(0).toUpperCase() + mockInvoice.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Issue Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(mockInvoice.issue_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(mockInvoice.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Bill To</div>
                <div>
                  <div className="font-medium">{mockInvoice.client.name}</div>
                  <div className="text-sm text-muted-foreground">{mockInvoice.client.email}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Items</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  
                  {mockInvoice.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 text-sm py-2 border-b">
                      <div className="col-span-6">{item.description}</div>
                      <div className="col-span-2 text-right">{item.quantity}</div>
                      <div className="col-span-2 text-right">
                        ${item.rate.toFixed(2)}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${mockInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${mockInvoice.tax_amount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${mockInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {mockInvoice.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{mockInvoice.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={statusColors[mockInvoice.status]}>
                    {mockInvoice.status.charAt(0).toUpperCase() + mockInvoice.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="font-medium">${mockInvoice.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Client</span>
                  <span className="font-medium">{mockInvoice.client.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(mockInvoice.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}