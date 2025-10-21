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
  Check,
  Trash2,
  X,
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
import { ExportButton } from "@/components/common/ExportButton";
import { ExportFilters, analyticsService } from "@/services/analyticsService";
import { BulkAction, BulkActionsBar } from "@/components/common/BulkActionsBar";
import {
  AdvancedFilters,
  AdvancedFilterValues,
} from "@/components/common/AdvancedFilters";
import { Checkbox } from "@/components/ui/checkbox";

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
  stripe: "Stripe",
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>(
    {}
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
    queryKey: ["payments", page, statusFilter, methodFilter, advancedFilters],
    queryFn: () =>
      paymentService.getPayments({
        page,
        limit: 10,
        status: statusFilter !== "all" ? statusFilter : undefined,
        paymentMethod: methodFilter !== "all" ? methodFilter : undefined,
        startDate: advancedFilters.startDate,
        endDate: advancedFilters.endDate,
        sortBy: advancedFilters.sortBy || "paymentDate",
        sortOrder: advancedFilters.sortOrder || "desc",
      }),
    placeholderData: keepPreviousData,
  });

  // Fetch payment stats
  const { data: statsData, isLoading: statsLoading } = usePaymentStatsQuery();

  const payments = paymentsData?.data || [];
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
      paymentMethod: data.method,
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
      title: "success",
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

  const handleExport = async (filters: ExportFilters) => {
    try {
      await analyticsService.exportData("payments", filters);
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  };

  // ADD selection handlers:
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(payments.map((payment) => payment.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const isAllSelected =
    payments.length > 0 && selectedIds.length === payments.length;

  // ADD bulk operation handlers:
  const handleBulkDelete = async (ids: string[]) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${ids.length} payment(s)?`
      )
    ) {
      try {
        const result = await paymentService.bulkDelete(ids);
        toast({
          title: "Success",
          description: `Deleted ${result.deletedCount} payment(s)`,
        });
        setSelectedIds([]);
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete payments",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkUpdateStatus = async (
    ids: string[],
    status: PaymentStatus
  ) => {
    if (
      window.confirm(
        `Are you sure you want to update ${ids.length} payment(s)?`
      )
    ) {
      try {
        const result = await paymentService.bulkUpdateStatus(ids, status);
        toast({
          title: "Success",
          description: `Updated ${result.modifiedCount} payment(s)`,
        });
        setSelectedIds([]);
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update payments",
          variant: "destructive",
        });
      }
    }
  };

  // DEFINE bulk actions:
  const bulkActions: BulkAction[] = [
    {
      id: "mark-completed",
      label: "Mark Completed",
      icon: <Check className="mr-2 h-4 w-4" />,
      variant: "default",
      onClick: (ids) => handleBulkUpdateStatus(ids, "completed"),
    },
    {
      id: "mark-failed",
      label: "Mark Failed",
      icon: <X className="mr-2 h-4 w-4" />,
      variant: "outline",
      onClick: (ids) => handleBulkUpdateStatus(ids, "failed"),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: "destructive",
      onClick: handleBulkDelete,
    },
  ];

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
        <div className="flex gap-2">
          <ExportButton
            type="payments"
            onExport={handleExport}
            variant="outline"
          />
          <Button onClick={() => setRecordDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
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
            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as PaymentStatus | "all")
              }
            >
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

            {/* Method Filter */}
            <Select
              value={methodFilter}
              onValueChange={(value) =>
                setMethodFilter(value as PaymentMethod | "all")
              }
            >
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

            {/* Advanced Filters */}
            <AdvancedFilters
              onApply={setAdvancedFilters}
              onClear={() => setAdvancedFilters({})}
              currentFilters={advancedFilters}
              filterOptions={{
                showDateRange: true,
                showAmountRange: true,
                showSort: true,
                sortOptions: [
                  { value: "paymentDate", label: "Payment Date" },
                  { value: "amount", label: "Amount" },
                  { value: "status", label: "Status" },
                ],
              }}
            />

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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
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
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(payment.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOne(payment.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {payment.invoiceId ? (
                            <button
                              onClick={() =>
                                handleViewInvoice(payment.invoiceId)
                              }
                              className="hover:underline text-left font-medium"
                            >
                              {payment.invoiceId?.invoiceNumber}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">
                              {typeof payment.invoiceId === "string"
                                ? payment.invoiceId.slice(0, 8)
                                : "N/A"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {paymentMethodLabels[payment.paymentMethod]}
                        </TableCell>
                        <TableCell>
                          {payment.stripePaymentIntentId ? (
                            <span className="font-mono text-sm">
                              {payment.stripePaymentIntentId}
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
                                  handleViewInvoice(payment.invoiceId.id)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDownloadReceipt(payment.id)
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
      <BulkActionsBar
        selectedCount={selectedIds.length}
        totalCount={payments.length}
        onClearSelection={() => setSelectedIds([])}
        actions={bulkActions}
        selectedIds={selectedIds}
      />
    </div>
  );
}
