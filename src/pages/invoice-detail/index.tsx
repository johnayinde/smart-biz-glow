import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Send,
  Edit,
  DollarSign,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import {
  useInvoiceQuery,
  useMarkInvoiceAsPaid,
} from "@/hooks/queries/use-invoices-query";
import {
  useReminderHistoryQuery,
  useSendManualReminder,
} from "@/hooks/queries/use-reminders-query";
import { ReminderTimeline } from "@/components/reminders/reminder-timeline";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const statusColors = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
} as const;

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: invoice, isLoading } = useInvoiceQuery(id!);
  const { data: reminders = [] } = useReminderHistoryQuery(id!);
  const markAsPaid = useMarkInvoiceAsPaid();
  const sendManualReminder = useSendManualReminder();

  const handleMarkAsPaid = async () => {
    try {
      await markAsPaid.mutateAsync(id!);
      toast({ title: "Invoice marked as paid" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendReminder = async () => {
    try {
      await sendManualReminder.mutateAsync(id!);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancelReminders = () => {
    toast({ title: "Feature coming soon" });
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!invoice) {
    return <div className="container mx-auto p-6">Invoice not found</div>;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoice.currency || "USD",
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/invoices")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
          <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
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
          {invoice.status !== "paid" && (
            <Button onClick={handleMarkAsPaid} disabled={markAsPaid.isPending}>
              <DollarSign className="h-4 w-4 mr-2" />
              {markAsPaid.isPending ? "Processing..." : "Mark as Paid"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Invoice Details</CardTitle>
                  <CardDescription>
                    Invoice #{invoice.invoiceNumber}
                  </CardDescription>
                </div>
                <Badge variant={statusColors[invoice.status]}>
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Issue Date
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Due Date
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-medium mb-4">Items</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">Rate</div>
                    <div className="col-span-2 text-right">Amount</div>
                  </div>
                  {invoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 py-2">
                      <div className="col-span-6">{item.description}</div>
                      <div className="col-span-2 text-right">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right">
                        {formatter.format(item.unitPrice)}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        {formatter.format(item.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatter.format(invoice.subtotal)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span>{formatter.format(invoice.taxAmount)}</span>
                  </div>
                )}
                {invoice.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-{formatter.format(invoice.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatter.format(invoice.total)}</span>
                </div>
              </div>

              {invoice.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Notes
                    </div>
                    <p className="text-sm">{invoice.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reminder Timeline */}
          <ReminderTimeline
            reminders={reminders}
            invoiceStatus={invoice.status}
            onSendManual={handleSendReminder}
            onCancelReminders={handleCancelReminders}
            isSending={sendManualReminder.isPending}
          />

          {/* Client Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Client ID
                </div>
                <div className="font-medium">{invoice.clientId}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
