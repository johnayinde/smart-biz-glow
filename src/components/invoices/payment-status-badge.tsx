import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, CreditCard } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: "paid" | "pending" | "unpaid";
  paymentMethod?: string;
}

export function PaymentStatusBadge({
  status,
  paymentMethod,
}: PaymentStatusBadgeProps) {
  if (status === "paid") {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      >
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Paid {paymentMethod && `via ${paymentMethod}`}
      </Badge>
    );
  }

  if (status === "pending") {
    return (
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Payment Pending
      </Badge>
    );
  }

  return (
    <Badge
      variant="destructive"
      className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    >
      <CreditCard className="mr-1 h-3 w-3" />
      Unpaid
    </Badge>
  );
}
