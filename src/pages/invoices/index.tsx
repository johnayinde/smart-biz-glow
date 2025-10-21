// src/pages/invoices/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  DollarSign,
  Download,
  CreditCard,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  invoiceService,
  InvoiceSortBy,
  InvoiceStatus,
} from "@/services/invoiceService";
import {
  useDeleteInvoice,
  useMarkInvoiceAsPaid,
} from "@/hooks/queries/use-invoices-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/clientService";
import { useInvoicesWithClients } from "@/hooks/useInvoicesWithClients";
import { useSendInvoice } from "@/hooks/queries/use-invoices-query";
import { ExportButton, ExportFilters } from "@/components/common/ExportButton";
import { analyticsService } from "@/services/analyticsService";

import {
  AdvancedFilters,
  type AdvancedFilterValues,
} from "@/components/common/AdvancedFilters";
import {
  BulkActionsBar,
  type BulkAction,
} from "@/components/common/BulkActionsBar";
import { Checkbox } from "@/components/ui/checkbox";
import { useInvoices } from "@/hooks/useInvoices";

const statusColors = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
} as const;

const statusLabels = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export default function Invoices() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">();
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const sendInvoiceMutation = useSendInvoice();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [invoiceToSend, setInvoiceToSend] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValues>(
    {}
  );
  const [clientFilter, setClientFilter] = useState<string>("all");

  // const { data:invoices, isLoading, error, meta, refetch } = useInvoices({
  //   page: 1,
  //   limit: 10,
  //   search: searchTerm || undefined,
  //   status: statusFilter !== "all" ? statusFilter : undefined,
  // });

  const { invoices, isLoading, error, meta, refetch } = useInvoicesWithClients({
    page,
    limit: 10,
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    clientId: clientFilter !== "all" ? clientFilter : undefined,
    startDate: advancedFilters.startDate,
    endDate: advancedFilters.endDate,
    sortBy: (advancedFilters.sortBy as InvoiceSortBy) || "issueDate",
    sortOrder: advancedFilters.sortOrder || "desc",
  });

  const deleteMutation = useDeleteInvoice();
  const markAsPaidMutation = useMarkInvoiceAsPaid();

  const totalPages = meta?.totalPages || 1;

  // Fetch all clients (cache this globally)
  const { data: clientsResponse, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", "all"],
    queryFn: () => clientService.getClients({ limit: 100 }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Handlers

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteMutation.mutate(invoiceToDelete);
    }
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as InvoiceStatus | "all");
    setPage(1);
  };

  const handleViewInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  const handleEditInvoice = (id: string) => {
    navigate(`/invoices/edit/${id}`);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleMarkAsPaid = (id: string) => {
    if (window.confirm("Are you sure you want to mark this invoice as paid?")) {
      markAsPaidMutation.mutate(id);
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

  const handleSendInvoice = (id: string) => {
    setInvoiceToSend(id);
    setSendDialogOpen(true);
  };

  const confirmSend = async () => {
    if (!invoiceToSend) return;

    try {
      await sendInvoiceMutation.mutateAsync(invoiceToSend);
      setSendDialogOpen(false);
      setInvoiceToSend(null);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleExport = async (filters: ExportFilters) => {
    try {
      await analyticsService.exportData("invoices", filters);
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(invoices.map((inv) => inv.id));
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
    invoices.length > 0 && selectedIds.length === invoices.length;
  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < invoices.length;

  // ADD bulk operation handlers:
  const handleBulkDelete = async (ids: string[]) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${ids.length} invoice(s)?`
      )
    ) {
      try {
        const result = await invoiceService.bulkDelete(ids);
        toast({
          title: "Success",
          description: `Deleted ${result.deletedCount} invoice(s)${
            result.failedIds.length > 0
              ? `. ${result.failedIds.length} failed.`
              : ""
          }`,
        });
        setSelectedIds([]);
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete invoices",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkSend = async (ids: string[]) => {
    if (
      window.confirm(`Are you sure you want to send ${ids.length} invoice(s)?`)
    ) {
      try {
        const result = await invoiceService.bulkSend(ids);
        toast({
          title: "Success",
          description: `Sent ${result.sentCount} invoice(s)${
            result.failedIds.length > 0
              ? `. ${result.failedIds.length} failed.`
              : ""
          }`,
        });
        setSelectedIds([]);
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send invoices",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkMarkAsPaid = async (ids: string[]) => {
    if (
      window.confirm(
        `Are you sure you want to mark ${ids.length} invoice(s) as paid?`
      )
    ) {
      try {
        const result = await invoiceService.bulkUpdateStatus(ids, "paid");
        toast({
          title: "Success",
          description: `Updated ${result.modifiedCount} invoice(s)${
            result.failedIds.length > 0
              ? `. ${result.failedIds.length} failed.`
              : ""
          }`,
        });
        setSelectedIds([]);
        refetch();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update invoices",
          variant: "destructive",
        });
      }
    }
  };

  // DEFINE bulk actions:
  const bulkActions: BulkAction[] = [
    {
      id: "send",
      label: "Send",
      icon: <Send className="mr-2 h-4 w-4" />,
      variant: "default",
      onClick: handleBulkSend,
    },
    {
      id: "mark-paid",
      label: "Mark as Paid",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      variant: "default",
      onClick: handleBulkMarkAsPaid,
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

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Invoices</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load invoices. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track your invoices
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            type="invoices"
            onExport={handleExport}
            variant="outline"
          />
          <Button onClick={() => navigate("/invoices/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            A list of all your invoices and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or client..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Client Filter */}
            {/* <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clientsResponse?.data?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

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
                  { value: "issueDate", label: "Issue Date" },
                  { value: "dueDate", label: "Due Date" },
                  { value: "total", label: "Amount" },
                  { value: "invoiceNumber", label: "Invoice Number" },
                ],
              }}
            />

            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {/* Invoices Table */}
          {invoices?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No invoices found</p>
              <Button onClick={() => navigate("/invoices/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Invoice
              </Button>
            </div>
          ) : (
            <>
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
                      <TableHead>Invoice</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices?.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(invoice.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOne(invoice.id, checked as boolean)
                            }
                            aria-label={`Select invoice ${invoice.invoiceNumber}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="hover:underline text-primary"
                          >
                            {invoice.invoiceNumber}
                          </button>
                        </TableCell>
                        <TableCell>
                          {invoice.client?.name || "Unknown Client"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.issueDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>${invoice.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[invoice.status]}>
                            {statusLabels[invoice.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleViewInvoice(invoice.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditInvoice(invoice.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {invoice.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() => handleSendInvoice(invoice.id)}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Invoice
                                </DropdownMenuItem>
                              )}
                              {invoice.status !== "paid" && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkAsPaid(invoice.id)}
                                >
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() =>
                                  invoiceService.downloadInvoice(invoice.id)
                                }
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the invoice as sent and schedule automatic payment
              reminders. The client will receive reminder emails based on your
              configured schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSend}
              disabled={sendInvoiceMutation.isPending}
            >
              {sendInvoiceMutation.isPending ? "Sending..." : "Send Invoice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkActionsBar
        selectedCount={selectedIds.length}
        totalCount={invoices.length}
        onClearSelection={() => setSelectedIds([])}
        actions={bulkActions}
        selectedIds={selectedIds}
      />
    </div>
  );
}
