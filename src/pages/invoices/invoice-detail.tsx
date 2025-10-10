// src/pages/invoice-detail/index.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Send,
  Edit,
  DollarSign,
  Calendar,
  ArrowLeft,
  Mail,
  Phone,
  Building,
  AlertCircle,
} from "lucide-react";
import { invoiceService } from "@/services/invoiceService";
import { clientService } from "@/services/clientService";
import { ReminderTimeline } from "@/components/reminders/reminder-timeline";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import { RecordPaymentDialog } from "@/components/payments/record-payment-dialog";
import reminderService from "@/services/reminderService";

const statusColors = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
} as const;

export default function InvoiceDetail() {
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invoice data
  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    error: invoiceError,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoiceService.getInvoiceById(id!),
    enabled: !!id,
  });
  // console.log(invoiceData);

  const invoice = invoiceData?.data;

  // Fetch reminder history
  const { data: remindersData, isLoading: remindersLoading } = useQuery({
    queryKey: ["reminders", id],
    queryFn: () => reminderService.getReminderHistory(id!),
    enabled: !!id && invoice?.status !== "draft",
  });

  const reminders = remindersData || [];

  // Fetch client details
  const { data: clientData } = useQuery({
    queryKey: ["client", invoice?.clientId],
    queryFn: () => clientService.getClientById(invoice!.clientId),
    enabled: !!invoice?.clientId,
  });

  const client = clientData?.data;

  // Mark as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: () =>
      invoiceService.updateInvoice(id!, { status: "paid" as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["reminders", id] });
      toast({
        title: "Success",
        description: "Invoice marked as paid. Reminders have been cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark invoice as paid.",
        variant: "destructive",
      });
    },
  });

  // Send manual reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: () => reminderService.sendManualReminder(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", id] });
      toast({
        title: "Success",
        description: "Reminder sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reminder.",
        variant: "destructive",
      });
    },
  });

  // Cancel reminders mutation
  const cancelRemindersMutation = useMutation({
    mutationFn: () => reminderService.cancelReminders(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", id] });
      toast({
        title: "Success",
        description: "All reminders have been cancelled.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel reminders.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleMarkAsPaid = () => {
    if (window.confirm("Are you sure you want to mark this invoice as paid?")) {
      markAsPaidMutation.mutate();
    }
  };

  const handleSendReminder = () => {
    sendReminderMutation.mutate();
  };

  const handleCancelReminders = () => {
    if (window.confirm("Are you sure you want to cancel all reminders?")) {
      cancelRemindersMutation.mutate();
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      await invoiceService.downloadInvoice(id);
      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download invoice",
        variant: "destructive",
      });
    }
  };

  const handleSendInvoice = () => {
    toast({
      title: "Coming soon",
      description: "Email sending will be available soon.",
    });
  };
  console.log({ invoice });

  // Loading state
  if (invoiceLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (invoiceError || !invoice) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/invoices")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load invoice. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: invoice.currency || "USD",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">
              Invoice details and management
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleDownloadPDF(id!)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>

          {invoice.status !== "paid" && (
            <Button onClick={() => setRecordPaymentOpen(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          )}
          {invoice.status === "draft" && (
            <Button onClick={handleSendInvoice}>
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
            </Button>
          )}
          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <Button
              onClick={handleMarkAsPaid}
              disabled={markAsPaidMutation.isPending}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              {markAsPaidMutation.isPending ? "Processing..." : "Mark as Paid"}
            </Button>
          )}
          <Button onClick={() => navigate(`/invoices/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details Card */}
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
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Issue Date
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Due Date
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Line Items */}
              <div>
                <h3 className="font-medium mb-4">Items</h3>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">
                          Description
                        </th>
                        <th className="py-3 px-4 text-center font-medium">
                          Quantity
                        </th>
                        <th className="py-3 px-4 text-right font-medium">
                          Rate
                        </th>
                        <th className="py-3 px-4 text-right font-medium">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 px-4">{item.description}</td>
                          <td className="py-3 px-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {formatter.format(item.rate)}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            {formatter.format(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatter.format(invoice.subtotal)}</span>
                </div>
                {invoice.tax && invoice.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatter.format(invoice.tax)}</span>
                  </div>
                )}
                {invoice.discount && invoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
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

              {/* Notes */}
              {invoice.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Notes
                    </div>
                    <p className="text-sm">{invoice.notes}</p>
                  </div>
                </>
              )}

              {/* Terms */}
              {invoice.terms && (
                <>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Payment Terms
                    </div>
                    <p className="text-sm">{invoice.terms}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reminder Timeline */}
          {invoice.status !== "draft" && (
            // <ReminderTimeline
            //   reminders={reminders}
            //   invoiceStatus={invoice.status}
            //   onSendManual={handleSendReminder}
            //   onCancelReminders={handleCancelReminders}
            //   isSending={sendReminderMutation.isPending}
            //   isLoading={remindersLoading}
            // />
            <ReminderTimeline
              reminders={reminders}
              invoiceStatus={invoice.status}
              dueDate={invoice.dueDate} // NEW: Add this
              reminderConfig={{
                // NEW: Add this
                enabled: invoice.reminderConfig?.enabled ?? true,
                sequenceType: invoice.reminderConfig?.sequenceType,
                remindersSent: invoice.reminderConfig?.remindersSent,
                nextReminderDate: invoice.reminderConfig?.nextReminderDate
                  ? new Date(
                      invoice.reminderConfig.nextReminderDate
                    ).toISOString()
                  : undefined,
              }}
              onSendManual={handleSendReminder}
              onCancelReminders={handleCancelReminders}
              // onRetryReminder={handleRetryReminder} // NEW: Add this function
              isSending={sendReminderMutation.isPending}
              isLoading={remindersLoading}
            />
          )}

          {/* Client Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {client ? (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </div>
                    <div className="font-medium">{client.name}</div>
                  </div>
                  {client.company && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Company
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {client.company}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${client.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {client.email}
                      </a>
                    </div>
                  </div>
                  {client.phone && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Phone
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${client.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {client.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {client.address && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Address
                      </div>
                      <div className="text-sm">
                        {client.address.street && (
                          <div>{client.address.street}</div>
                        )}
                        {(client.address.city || client.address.state) && (
                          <div>
                            {client.address.city}
                            {client.address.city &&
                              client.address.state &&
                              ", "}
                            {client.address.state} {client.address.postalCode}
                          </div>
                        )}
                        {client.address.country && (
                          <div>{client.address.country}</div>
                        )}
                      </div>
                    </div>
                  )}
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    View Client Details
                  </Button>
                </>
              ) : (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Client ID
                  </div>
                  <div className="font-medium">{invoice.clientId}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status Card */}
          {invoice.status === "paid" && invoice.paidAt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  Payment Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Paid On
                    </div>
                    <div>{format(new Date(invoice.paidAt), "PPP")}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Amount
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatter.format(invoice.total)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Dialog */}
      {/* <RecordPaymentDialog
        open={recordPaymentOpen}
        onOpenChange={setRecordPaymentOpen}
        preSelectedInvoiceId={id}
        onSubmit={handleRecordPayment}
        isSubmitting={createPaymentMutation.isPending}
      /> */}
    </div>
  );
}
