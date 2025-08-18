
import { Badge } from "@/components/ui/badge";
import { InvoiceStatus } from "@/services/mockData";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const getStatusStyles = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "bg-status-paid-bg text-invoice-paid-foreground border-invoice-paid/20";
      case "pending":
        return "bg-status-pending-bg text-invoice-pending-foreground border-invoice-pending/20";
      case "overdue":
        return "bg-status-overdue-bg text-invoice-overdue-foreground border-invoice-overdue/20";
      case "draft":
        return "bg-status-draft-bg text-invoice-draft-foreground border-invoice-draft/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusText = (status: InvoiceStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge variant="outline" className={`${getStatusStyles(status)} ${className}`}>
      {getStatusText(status)}
    </Badge>
  );
}
