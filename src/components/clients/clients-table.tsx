
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/services/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface ClientsTableProps {
  clients: Client[];
  onEditClient?: (clientId: string) => void;
  onCreateInvoice?: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
}

export const ClientsTable = ({ clients, onEditClient, onCreateInvoice, onDeleteClient }: ClientsTableProps) => {
  const handleViewDetails = (clientId: string) => {
    window.location.href = `/clients/${clientId}`;
  };

  const handleEdit = (clientId: string) => {
    onEditClient?.(clientId);
  };

  const handleCreateInvoice = (clientId: string) => {
    onCreateInvoice?.(clientId);
  };

  const handleDelete = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      onDeleteClient?.(clientId);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Total Billed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <Link to={`/clients/${client.id}`} className="hover:underline">
                  {client.name}
                </Link>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(client.totalBilled)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={client.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}
                >
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
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
                    <DropdownMenuItem onClick={() => handleViewDetails(client.id.toString())}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(client.id.toString())}>
                      Edit client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCreateInvoice(client.id.toString())}>
                      Create invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(client.id.toString())}
                    >
                      Delete client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
