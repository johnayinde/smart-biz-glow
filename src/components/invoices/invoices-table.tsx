
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/services/mockData";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface InvoicesTableProps {
  invoices: Invoice[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const handleDownload = (invoiceId: string) => {
    // Create a download link for the invoice
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      // In a real app, this would generate and download a PDF
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Invoice ${invoice.invoiceNumber} - ${invoice.clientName}`));
      element.setAttribute('download', `invoice-${invoice.invoiceNumber}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };
  
  const handleEdit = (invoiceId: string) => {
    // Navigate to edit page or open edit dialog
    window.location.href = `/invoices/${invoiceId}/edit`;
  };
  
  const handleMarkAsPaid = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice && window.confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
      // Update invoice status to paid
      console.log(`Marking invoice ${invoiceId} as paid`);
      // In a real app, this would update the database
    }
  };
  
  const handleDelete = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice && window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      console.log(`Deleting invoice ${invoiceId}`);
      // In a real app, this would delete from the database
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                <Link to={`/invoices/${invoice.id}`} className="hover:underline text-primary">
                  {invoice.invoiceNumber}
                </Link>
              </TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: invoice.currency
                }).format(invoice.total)}
              </TableCell>
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} />
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
                    <DropdownMenuItem onClick={() => handleDownload(invoice.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(invoice.id)}>
                      Edit invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                      Mark as paid
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Delete invoice
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
