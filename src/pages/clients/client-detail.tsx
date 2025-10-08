// ==========================================
// FILE: src/pages/client-detail/index.tsx - COMPLETE REWRITE
// ==========================================

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  Mail,
  Phone,
  Globe,
  MapPin,
  Plus,
  DollarSign,
  FileText,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Building,
} from "lucide-react";
import { clientService } from "@/services/clientService";
import { invoiceService } from "@/services/invoiceService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import { EditClientDialog } from "@/components/clients/edit-client-dialog";

const statusColors = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
} as const;

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // ✅ Fetch client data
  const {
    data: clientResponse,
    isLoading: clientLoading,
    error: clientError,
  } = useQuery({
    queryKey: ["client", id],
    queryFn: () => clientService.getClientById(id!),
    enabled: !!id,
  });

  const client = clientResponse?.data;

  // ✅ Fetch client stats (invoices count, total billed, etc.)
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ["client-stats", id],
    queryFn: async () => {
      // Backend endpoint: GET /clients/:id/stats
      return clientService.getClientById(id!); // Or use a dedicated stats endpoint if available
    },
    enabled: !!id,
  });

  // ✅ Fetch client's invoices
  const { data: invoicesResponse, isLoading: invoicesLoading } = useQuery({
    queryKey: ["client-invoices", id],
    queryFn: () =>
      invoiceService.getInvoices({
        clientId: id,
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    enabled: !!id,
  });

  const invoices = invoicesResponse?.data || [];

  // ✅ Update client mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => clientService.updateClient(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      setEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update client",
        variant: "destructive",
      });
    },
  });

  // ✅ Calculate totals from invoices
  const calculateTotals = () => {
    const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalPending = invoices
      .filter((inv) => inv.status === "sent")
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalOverdue = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalBilled,
      totalPaid,
      totalPending,
      totalOverdue,
      invoiceCount: invoices.length,
    };
  };

  const totals = calculateTotals();

  // ✅ Loading state
  if (clientLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (clientError || !client) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {clientError instanceof Error
              ? clientError.message
              : "Client not found"}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/clients")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">
            Client since {format(new Date(client.createdAt), "MMMM yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <Button
            onClick={() => navigate(`/invoices/new?clientId=${client.id}`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant={
                    client.status === "active" ? "default" : "destructive"
                  }
                >
                  {client.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-3 pt-4">
                {client.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      {/* <a
                        href={`mailto:${client.email}`}
                        className="text-sm text-primary hover:underline"
                      > */}
                      {client.email}
                    </div>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Phone</p>
                      {/* <a
                        href={`tel:${client.phone}`}
                        className="text-sm text-primary hover:underline"
                      > */}
                      {client.phone}
                      {/* </a> */}
                    </div>
                  </div>
                )}

                {client.company && (
                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm">{client.company}</p>
                    </div>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {client.address.street && `${client.address.street}, `}
                        {client.address.city && `${client.address.city}, `}
                        {client.address.state} {client.address.postalCode}
                        {client.address.country &&
                          `, ${client.address.country}`}
                      </p>
                    </div>
                  </div>
                )}

                {client.taxId && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Tax ID</p>
                      <p className="text-sm text-muted-foreground">
                        {client.taxId}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {client.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {client.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold">
                  ${totals.totalBilled.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-lg font-semibold text-green-600">
                    ${totals.totalPaid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    ${totals.totalPending.toLocaleString()}
                  </p>
                </div>
              </div>
              {totals.totalOverdue > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-lg font-semibold text-red-600">
                    ${totals.totalOverdue.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-lg font-semibold">{totals.invoiceCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Invoices */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All invoices for {client.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No invoices yet for this client
                  </p>
                  <Button
                    onClick={() =>
                      navigate(`/invoices/new?clientId=${client.id}`)
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            <button
                              onClick={() =>
                                navigate(`/invoices/${invoice.id}`)
                              }
                              className="hover:underline text-left"
                            >
                              {invoice.invoiceNumber}
                            </button>
                          </TableCell>
                          <TableCell>
                            {format(
                              new Date(invoice.issueDate),
                              "MMM dd, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            ${invoice.total.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                statusColors[invoice.status] || "default"
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/invoices/${invoice.id}`)
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Client Dialog */}
      {client && (
        <EditClientDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          client={client}
          onSubmit={(data) => updateMutation.mutate(data)}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
