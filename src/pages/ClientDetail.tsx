
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMockData } from "@/services/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, FileText, Mail, MapPin, Phone, Plus, User } from "lucide-react";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { Separator } from "@/components/ui/separator";
import { CreateInvoiceDialog } from "@/components/invoices/create-invoice-dialog";
import { EditClientDialog } from "@/components/clients/edit-client-dialog";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState(getMockData.clientById(id || ""));
  const [clientInvoices, setClientInvoices] = useState(getMockData.invoicesByClientId(id || ""));
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
        <p className="text-muted-foreground mb-6">The client you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/clients">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{client.name}</h2>
          <Badge
            variant="outline"
            className={client.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}
          >
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditClientOpen(true)}>
            Edit Client
          </Button>
          <Button onClick={() => setIsCreateInvoiceOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Details about this client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              {client.company ? (
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div>
                <p className="font-medium">{client.name}</p>
                {client.company && (
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                )}
                <Badge className="mt-1">
                  {client.company ? "Business" : "Individual"}
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{client.email}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{client.phone}</p>
              </div>
              
              {client.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p>{client.address.street}</p>
                    <p>{client.address.city}, {client.address.state} {client.address.zip}</p>
                    <p>{client.address.country}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Payment Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Total Billed:</div>
                <div className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(client.totalBilled)}
                </div>
                
                <div className="text-muted-foreground">Outstanding:</div>
                <div className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(client.totalBilled * 0.2)}
                </div>
                
                <div className="text-muted-foreground">Last Payment:</div>
                <div className="font-medium">April 15, 2023</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Client Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="invoices">
              <TabsList className="mx-4">
                <TabsTrigger value="invoices">
                  Invoices ({clientInvoices.length})
                </TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              
              <TabsContent value="invoices" className="m-0">
                {clientInvoices.length > 0 ? (
                  <InvoicesTable invoices={clientInvoices} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <FileText className="h-12 w-12 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">No invoices yet</h3>
                    <p className="mt-2 text-center text-muted-foreground">
                      This client doesn't have any invoices yet.
                    </p>
                    <Button className="mt-4" onClick={() => setIsCreateInvoiceOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <p className="text-muted-foreground">No notes have been added for this client.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="files">
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <p className="text-muted-foreground">No files have been attached to this client.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <CreateInvoiceDialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen} />
      <EditClientDialog 
        open={isEditClientOpen} 
        onOpenChange={setIsEditClientOpen} 
        client={client} 
      />
    </div>
  );
};

export default ClientDetail;
