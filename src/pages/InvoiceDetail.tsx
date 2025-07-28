import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMockData } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Edit, Mail, Printer, Share } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { toast } from "@/hooks/use-toast";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice] = useState(getMockData.getInvoice(id || ""));
  
  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <h2 className="text-2xl font-bold mb-4">Invoice Not Found</h2>
        <p className="text-muted-foreground mb-6">The invoice you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/invoices">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Link>
        </Button>
      </div>
    );
  }

  const client = getMockData.getClient(invoice.clientId.toString());
  
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Invoice ${invoice.invoiceNumber} is being downloaded as PDF.`,
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit Invoice",
      description: "Edit functionality will be available soon.",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: `Invoice ${invoice.invoiceNumber} has been sent to ${client?.email}.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast({
      title: "Share Link",
      description: "Share link has been copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/invoices">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h2>
            <div className="flex items-center gap-2 mt-1">
              <InvoiceStatusBadge status={invoice.status} />
              <span className="text-sm text-muted-foreground">
                Created {new Date(invoice.issueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
              <p className="text-lg text-muted-foreground">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold mb-2">Your Company</h3>
              <p className="text-sm text-muted-foreground">
                123 Business Street<br />
                City, State 12345<br />
                contact@company.com<br />
                (555) 123-4567
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bill To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">Bill To:</h4>
              <div className="text-sm">
                <p className="font-medium text-base">{client?.name}</p>
                {client?.company && <p>{client.company}</p>}
                {client?.address && (
                  <>
                    <p>{client.address.street}</p>
                    <p>{client.address.city}, {client.address.state} {client.address.zip}</p>
                    <p>{client.address.country}</p>
                  </>
                )}
                <p className="mt-2">{client?.email}</p>
                <p>{client?.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Invoice Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Terms:</span>
                  <span>Net 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Description</th>
                    <th className="text-right p-4 font-semibold w-20">Qty</th>
                    <th className="text-right p-4 font-semibold w-32">Rate</th>
                    <th className="text-right p-4 font-semibold w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{item.description}</p>
                        </div>
                      </td>
                      <td className="p-4 text-right">{item.quantity}</td>
                      <td className="p-4 text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: invoice.currency
                        }).format(item.rate)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: invoice.currency
                        }).format(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(invoice.total * 0.9)} {/* Calculated subtotal */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(invoice.total * 0.1)} {/* Calculated tax */}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: invoice.currency
                    }).format(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-3">Notes:</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Terms */}
          <div className="border-t pt-6 mt-6">
            <h4 className="text-lg font-semibold mb-3">Terms & Conditions:</h4>
            <p className="text-sm text-muted-foreground">
              Payment is due within 30 days of the invoice date. Late payments may be subject to fees.
              Please include the invoice number when making payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;