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
import { invoiceService, InvoiceStatus } from "@/services/invoiceService";
import {
  useDeleteInvoice,
  useMarkInvoiceAsPaid,
} from "@/hooks/queries/use-invoices-query";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/clientService";
import { useInvoicesWithClients } from "@/hooks/useInvoicesWithClients";
import { useSendInvoice } from "@/hooks/queries/use-invoices-query";

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

  const { invoices, isLoading, error, meta, refetch } = useInvoicesWithClients({
    page: 1,
    limit: 10,
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
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
        <Button onClick={() => navigate("/invoices/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
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
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>

          {/* Invoices Table */}
          {invoices.length === 0 ? (
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
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="hover:underline text-left"
                          >
                            {invoice.invoiceNumber}
                          </button>
                        </TableCell>
                        <TableCell>{invoice.client?.name || "N/A"}</TableCell>
                        <TableCell>
                          {format(new Date(invoice.issueDate), "MMM d, yyyy") ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.dueDate), "MMM d, yyyy") ||
                            "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatter.format(invoice.total) || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColors[invoice.status]}>
                            {statusLabels[invoice.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {invoice.payment?.paymentLink &&
                            invoice.status !== "paid" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    invoice.payment?.paymentLink,
                                    "_blank"
                                  );
                                }}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay Online
                              </Button>
                            )}
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
                                onClick={() => handleViewInvoice(invoice.id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditInvoice(invoice.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadPDF(invoice.id)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {invoice.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() => handleSendInvoice(invoice.id)}
                                >
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Invoice
                                </DropdownMenuItem>
                              )}
                              {(invoice.status === "sent" ||
                                invoice.status === "overdue") && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkAsPaid(invoice.id)}
                                >
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Mark as Paid
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteInvoice(invoice.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Invoice
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
    </div>
  );
}
