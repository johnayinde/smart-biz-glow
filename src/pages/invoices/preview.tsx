// src/pages/invoices/preview.tsx
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";
import { useTemplate } from "@/hooks/queries/use-template-query";
import { LivePreview } from "../templates/builder/LivePreview";
import { useInvoiceQuery } from "@/hooks/useInvoices";

export default function InvoicePreview() {
  const { id } = useParams();
  const {
    data: { data: invoice },
    isLoading: loadingInvoice,
  } = useInvoiceQuery(id);

  const {
    data: { data: template },
    isLoading: loadingTemplate,
  } = useTemplate(invoice?.templateId);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoice?.invoiceNumber}.pdf`;
      a.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loadingInvoice || loadingTemplate) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-card print:hidden sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Invoice Preview</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => window.close()}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LivePreview
            design={template?.design || getDefaultDesign()}
            viewMode="desktop"
            templateName={template?.name}
            defaults={template?.defaults}
          />
        </div>
      </div>
    </div>
  );
}

function getDefaultDesign() {
  return {
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      text: "#333333",
      textSecondary: "#666666",
      accent: "#28a745",
      background: "#ffffff",
      border: "#e0e0e0",
    },
    typography: {
      heading: "Inter",
      body: "Inter",
      size: { heading: 24, subheading: 18, body: 14, small: 12 },
    },
    logo: {
      url: "",
      position: "left" as "left",
      size: "medium",
      enabled: false,
    },
    layout: {
      pageSize: "A4",
      orientation: "portrait",
      margins: { top: 40, right: 40, bottom: 40, left: 40 },
    },
    sections: {
      header: { enabled: true, fields: [], order: 1 },
      billTo: { enabled: true, fields: [], order: 2 },
      items: { enabled: true, fields: [], order: 3 },
      summary: { enabled: true, fields: [], order: 4 },
      footer: { enabled: true, fields: [], order: 5 },
      notes: { enabled: true, fields: [], order: 6 },
    },
    spacing: { lineHeight: 1.5, sectionGap: 24, itemGap: 12 },
    borders: { enabled: true, width: 1, style: "solid", color: "#e0e0e0" },
  };
}
