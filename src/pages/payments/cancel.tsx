import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle, ArrowLeft, CreditCard, HelpCircle } from "lucide-react";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-red-700 dark:text-red-400">
              Payment Cancelled
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Your payment was not completed
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <HelpCircle className="h-4 w-4" />
            <AlertDescription>
              No charges were made to your account. Your invoice remains unpaid.
            </AlertDescription>
          </Alert>

          {/* What Happened */}
          <div className="space-y-3">
            <p className="font-medium text-sm">What Happened?</p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>You cancelled the payment process before completion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>No payment was processed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>Your invoice status has not changed</span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-medium text-sm mb-3 text-blue-900 dark:text-blue-100">
              Ready to Complete Your Payment?
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              You can try again at any time. The payment link is still active
              and available in your invoice.
            </p>
            <Button onClick={() => navigate(-1)} className="w-full" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Try Payment Again
            </Button>
          </div>

          {/* Alternative Actions */}
          <div className="space-y-3">
            <p className="font-medium text-sm">Other Options:</p>
            <div className="grid gap-2">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full justify-start"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
              <Button
                onClick={() => navigate("/invoices")}
                variant="outline"
                className="w-full justify-start"
              >
                View All Invoices
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="pt-4 border-t">
            <p className="font-medium text-sm mb-2">Need Help?</p>
            <p className="text-sm text-muted-foreground mb-3">
              If you're experiencing issues with payment or have questions:
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:support@yourcompany.com"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                Email Support
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                Call Us: (123) 456-7890
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
