
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoicesTable } from "@/components/invoices/invoices-table";
import { getMockData } from "@/services/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const invoices = getMockData.invoices();
  
  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get invoices by status
  const draftInvoices = getMockData.invoicesByStatus("draft");
  const pendingInvoices = getMockData.invoicesByStatus("pending");
  const paidInvoices = getMockData.invoicesByStatus("paid");
  const overdueInvoices = getMockData.invoicesByStatus("overdue");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="w-full sm:w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({invoices.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftInvoices.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingInvoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueInvoices.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredInvoices.length > 0 ? (
            <InvoicesTable invoices={filteredInvoices} />
          ) : (
            <EmptyState query={searchQuery} />
          )}
        </TabsContent>
        <TabsContent value="draft">
          <InvoicesTable invoices={draftInvoices.filter(invoice => 
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
          )} />
        </TabsContent>
        <TabsContent value="pending">
          <InvoicesTable invoices={pendingInvoices.filter(invoice => 
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
          )} />
        </TabsContent>
        <TabsContent value="paid">
          <InvoicesTable invoices={paidInvoices.filter(invoice => 
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
          )} />
        </TabsContent>
        <TabsContent value="overdue">
          <InvoicesTable invoices={overdueInvoices.filter(invoice => 
            invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
          )} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ query }: { query: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>No invoices found</CardTitle>
      <CardDescription>
        {query ? `No invoices matching "${query}"` : "Create your first invoice to get started"}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center py-6">
      <FileText className="h-12 w-12 text-muted-foreground/60" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {query ? "Try adjusting your search terms" : "You have not created any invoices yet"}
      </p>
      <Button className="mt-4">
        <Plus className="mr-2 h-4 w-4" /> Create Invoice
      </Button>
    </CardContent>
  </Card>
);

export default Invoices;
