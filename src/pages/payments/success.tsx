import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Download, Home, Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  // You can fetch invoice details using the session ID
  // For now, we'll show a generic success message

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">
              Payment Successful!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Your payment has been processed successfully
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Details */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">Payment confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">Invoice marked as paid</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">Confirmation email sent</span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="text-sm space-y-2">
              <p className="text-muted-foreground">Transaction ID:</p>
              <p className="font-mono text-xs bg-muted p-2 rounded">
                {sessionId}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="pt-4 space-y-3">
            <p className="font-medium text-sm">What's Next?</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>A payment receipt has been sent to your email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>The invoice status has been updated to "Paid"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>No further payment reminders will be sent</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="flex-1"
              variant="default"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate("/invoices")}
              className="flex-1"
              variant="outline"
            >
              <Receipt className="mr-2 h-4 w-4" />
              View Invoices
            </Button>
          </div>

          {/* Support */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Need help?{" "}
              <a
                href="mailto:support@yourcompany.com"
                className="text-primary hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
