// src/components/invoices/PaymentLinkDisplay.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Copy,
  ExternalLink,
  Mail,
  Check,
  AlertCircle,
  Shield,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PaymentLinkDisplayProps {
  invoice: {
    _id: string;
    invoiceNumber: string;
    total: number;
    currency: string;
    status: string;
    payment?: {
      paymentLink?: string;
      stripeCheckoutSessionId?: string;
      stripePaymentIntentId?: string;
    };
  };
  onSendPaymentLink?: () => void;
  isSendingLink?: boolean;
}

export const PaymentLinkDisplay: React.FC<PaymentLinkDisplayProps> = ({
  invoice,
  onSendPaymentLink,
  isSendingLink = false,
}) => {
  const [copied, setCopied] = useState(false);

  const hasPaymentLink = invoice.payment?.paymentLink;
  const isPaid = invoice.status === "paid";
  const isDraft = invoice.status === "draft";
  const isCancelled = invoice.status === "cancelled";

  const handleCopyLink = () => {
    if (!invoice.payment?.paymentLink) return;

    navigator.clipboard.writeText(invoice.payment.paymentLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    if (!invoice.payment?.paymentLink) return;
    window.open(invoice.payment.paymentLink, "_blank");
  };

  const handleSendLink = () => {
    if (onSendPaymentLink) {
      onSendPaymentLink();
    } else {
      toast({
        title: "Feature coming soon",
        description: "Send payment link via email will be available soon",
      });
    }
  };

  // Don't show for paid or cancelled invoices
  if (isPaid || isCancelled) {
    return null;
  }

  // Show message for draft invoices
  if (isDraft) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Link
          </CardTitle>
          <CardDescription>
            Payment link will be generated when the invoice is sent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              A secure payment link will be automatically created when you send
              this invoice to your client.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show loading state if payment link is being generated
  if (!hasPaymentLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment link is being generated. This usually takes a few seconds.
              Please refresh the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Online Payment
            </CardTitle>
            <CardDescription>Secure payment powered by Stripe</CardDescription>
          </div>
          <Badge variant="default" className="gap-1">
            <Shield className="h-3 w-3" />
            Secure
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Benefits */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick & Secure Payment</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Pay with credit or debit card</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Instant payment confirmation</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>256-bit SSL encryption</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Main Payment Button */}
        <div className="space-y-3">
          <Button
            onClick={handleOpenLink}
            className="w-full"
            size="lg"
            variant="default"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay ${invoice.total.toFixed(2)} {invoice.currency} Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure checkout via Stripe • No account required
          </p>
        </div>

        <Separator />

        {/* Copy Link Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Share Payment Link</p>
          <div className="flex gap-2">
            <Input
              value={invoice.payment?.paymentLink}
              readOnly
              className="text-xs font-mono"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Send via Email Button */}
        {/* {onSendPaymentLink && (
          <>
            <Separator />
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSendLink}
              disabled={isSendingLink}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSendingLink ? "Sending..." : "Send Payment Link via Email"}
            </Button>
          </>
        )} */}

        {/* Session Info */}
        {invoice.payment?.stripeCheckoutSessionId && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Session ID:</p>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                {invoice.payment?.stripeCheckoutSessionId}
              </p>
            </div>
          </>
        )}

        {/* Security Notice */}
        <Alert className="bg-muted/50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            All payments are processed securely through Stripe. Your payment
            information is encrypted and never stored on our servers.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
