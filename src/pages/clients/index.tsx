import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientsTable } from "@/components/clients/clients-table";
import { getMockData } from "@/services/mockData";
import { Plus, Search, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import { EditClientDialog } from "@/components/clients/edit-client-dialog";
import { CreateInvoiceDialog } from "@/components/invoices/create-invoice-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState(getMockData.clients());
  
  // Filter clients based on search query and type
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === "all") return matchesSearch;
    if (filterType === "business") return matchesSearch && client.company;
    if (filterType === "individual") return matchesSearch && !client.company;
    
    return matchesSearch;
  });
  
  const handleNewClient = () => {
    setIsDialogOpen(true);
  };

  const handleEditClient = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
      setSelectedClient(client);
      setIsEditDialogOpen(true);
    }
  };

  const handleCreateInvoice = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId);
    if (client) {
      setSelectedClient(client);
      setIsInvoiceDialogOpen(true);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id.toString() !== clientId));
    toast({
      title: "Client Deleted",
      description: "The client has been successfully removed.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="w-full sm:w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleNewClient}>
            <Plus className="mr-2 h-4 w-4" /> New Client
          </Button>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Client List</CardTitle>
              <CardDescription>
                Manage your clients and their information
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Total: {filteredClients.length} clients
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClients.length > 0 ? (
            <ClientsTable 
              clients={filteredClients} 
              onEditClient={handleEditClient}
              onCreateInvoice={handleCreateInvoice}
              onDeleteClient={handleDeleteClient}
            />
          ) : (
            <EmptyState query={searchQuery} onAddClient={handleNewClient} />
          )}
        </CardContent>
      </Card>

      <CreateClientDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      {selectedClient && (
        <EditClientDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          client={selectedClient} 
        />
      )}
      <CreateInvoiceDialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen} />
    </div>
  );
};

const EmptyState = ({ query, onAddClient }: { query: string; onAddClient: () => void }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Users className="h-12 w-12 text-muted-foreground/60" />
    <p className="mt-4 text-center text-sm text-muted-foreground">
      {query ? `No clients matching "${query}"` : "You have not added any clients yet"}
    </p>
    <Button className="mt-4" onClick={onAddClient}>
      <Plus className="mr-2 h-4 w-4" /> Add Client
    </Button>
  </div>
);

export default Clients;