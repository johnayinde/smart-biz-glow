// src/pages/payments/index.tsx
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  paymentService,
  PaymentMethod,
  PaymentStatus,
} from "@/services/paymentService";
import { RecordPaymentDialog } from "@/components/payments/record-payment-dialog";
import {
  useCreatePayment,
  usePaymentStatsQuery,
} from "@/hooks/queries/use-payments-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "secondary",
  completed: "default",
  failed: "destructive",
  refunded: "outline",
} as const;

const statusLabels = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
};

const paymentMethodLabels = {
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  cash: "Cash",
  check: "Check",
  paypal: "PayPal",
  other: "Other",
};

export default function Payments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all"
  );
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);

  const createPaymentMutation = useCreatePayment();

  // Fetch payments
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch,
  } = useQuery({
    queryKey: ["payments", page, statusFilter, methodFilter],
    queryFn: () =>
      paymentService.getPayments({
        page,
        limit: 10,
        status: statusFilter !== "all" ? statusFilter : undefined,
        method: methodFilter !== "all" ? methodFilter : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  // Fetch payment stats
  const { data: statsData, isLoading: statsLoading } = usePaymentStatsQuery();

  const payments = paymentsData?.payments || [];
  const totalPages = paymentsData?.meta?.totalPages || 1;
  const stats = statsData?.data || {
    totalRevenue: 0,
    completed: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    failed: { count: 0, amount: 0 },
  };

  // Handlers
  const handleRecordPayment = (data: any) => {
    createPaymentMutation.mutate({
      invoiceId: data.invoiceId,
      amount: parseFloat(data.amount),
      method: data.method,
      paymentDate: data.paymentDate.toISOString(),
      reference: data.reference || undefined,
      notes: data.notes || undefined,
    });
    setRecordDialogOpen(false);
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDownloadReceipt = (paymentId: string) => {
    toast({
      title: "Coming soon",
      description: "Receipt download will be available soon.",
    });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as PaymentStatus | "all");
    setPage(1);
  };

  const handleMethodFilter = (value: string) => {
    setMethodFilter(value as PaymentMethod | "all");
    setPage(1);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Loading state for stats
  if (statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Track and manage all payments received
          </p>
        </div>
        <Button onClick={() => setRecordDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(stats.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.completed?.count || 0} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(stats.pending?.amount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pending?.count || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Collection Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue > 0
                ? Math.round(
                    ((stats.completed?.amount || 0) / stats.totalRevenue) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Based on completed payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A complete list of all payments received
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={handleMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {/* Loading State */}
          {paymentsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : paymentsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load payments. Please try again later.
              </AlertDescription>
            </Alert>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No payments found</p>
              <Button onClick={() => setRecordDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Record Your First Payment
              </Button>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell>
                          {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {payment.invoice ? (
                            <button
                              onClick={() =>
                                handleViewInvoice(payment.invoiceId)
                              }
                              className="hover:underline text-left font-medium"
                            >
                              {payment.invoice.invoiceNumber}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">
                              {payment.invoiceId.slice(0, 8)}...
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {paymentMethodLabels[payment.method]}
                        </TableCell>
                        <TableCell>
                          {payment.reference ? (
                            <span className="font-mono text-sm">
                              {payment.reference}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatter.format(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[payment.status]}>
                            {statusLabels[payment.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleViewInvoice(payment.invoiceId)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDownloadReceipt(payment._id)
                                }
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Record Payment Dialog */}
      <RecordPaymentDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        onSubmit={handleRecordPayment}
        isSubmitting={createPaymentMutation.isPending}
      />
    </div>
  );
}
