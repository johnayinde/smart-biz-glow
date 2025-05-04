
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientsTable } from "@/components/clients/clients-table";
import { getMockData } from "@/services/mockData";
import { Plus, Search, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const clients = getMockData.clients();
  
  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleNewClient = () => {
    console.log("New client button clicked");
    // Add your new client logic here
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
          <Button onClick={handleNewClient}>
            <Plus className="mr-2 h-4 w-4" /> New Client
          </Button>
        </div>
      </div>

      {filteredClients.length > 0 ? (
        <ClientsTable clients={filteredClients} />
      ) : (
        <EmptyState query={searchQuery} onAddClient={handleNewClient} />
      )}
    </div>
  );
};

const EmptyState = ({ query, onAddClient }: { query: string; onAddClient: () => void }) => (
  <Card>
    <CardHeader>
      <CardTitle>No clients found</CardTitle>
      <CardDescription>
        {query ? `No clients matching "${query}"` : "Add your first client to get started"}
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center py-6">
      <Users className="h-12 w-12 text-muted-foreground/60" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {query ? "Try adjusting your search terms" : "You have not added any clients yet"}
      </p>
      <Button className="mt-4" onClick={onAddClient}>
        <Plus className="mr-2 h-4 w-4" /> Add Client
      </Button>
    </CardContent>
  </Card>
);

export default Clients;
