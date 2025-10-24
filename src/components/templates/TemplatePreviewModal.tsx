// src/components/templates/TemplatePreviewModal.tsx
import { Template } from "@/services/templateService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Edit,
  Star,
  Monitor,
  Smartphone,
  Download,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onClose: () => void;
  onUse?: (template: Template) => void;
  onEdit?: (template: Template) => void;
  onDuplicate?: (template: Template) => void;
  onSetDefault?: (template: Template) => void;
}

export function TemplatePreviewModal({
  template,
  open,
  onClose,
  onUse,
  onEdit,
  onDuplicate,
  onSetDefault,
}: TemplatePreviewModalProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  if (!template) return null;

  const canEdit = !template.isSystemTemplate;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <DialogTitle className="text-2xl">{template.name}</DialogTitle>
                {template.isDefault && (
                  <Badge variant="default">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Default
                  </Badge>
                )}
                {template.isSystemTemplate && (
                  <Badge variant="secondary">System Template</Badge>
                )}
              </div>
              {template.description && (
                <DialogDescription className="text-base">
                  {template.description}
                </DialogDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("desktop")}
                className={cn(viewMode === "desktop" && "bg-accent")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode("mobile")}
                className={cn(viewMode === "mobile" && "bg-accent")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
          <div className="px-6">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
          </div>

          <Separator className="mt-2" />

          <TabsContent value="preview" className="flex-1 p-6 m-0">
            <ScrollArea className="h-full">
              <div className="flex justify-center">
                <div
                  className={cn(
                    "bg-white shadow-2xl transition-all",
                    viewMode === "desktop" ? "w-full max-w-3xl" : "w-96"
                  )}
                >
                  {/* Full Invoice Preview */}
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div
                      className={cn(
                        "flex items-start",
                        template.design?.logo?.position === "center" &&
                          "justify-center",
                        template.design?.logo?.position === "right" &&
                          "justify-end"
                      )}
                    >
                      <div className="space-y-2">
                        {template.design?.logo?.enabled && (
                          <div
                            className={cn(
                              "font-bold",
                              template.design?.logo?.size === "small" &&
                                "text-xl",
                              template.design?.logo?.size === "medium" &&
                                "text-2xl",
                              template.design?.logo?.size === "large" &&
                                "text-3xl"
                            )}
                            style={{ color: template.design?.colors?.primary }}
                          >
                            🏢 YOUR LOGO
                          </div>
                        )}
                        <div
                          className="font-bold text-3xl"
                          style={{ color: template.design?.colors?.primary }}
                        >
                          INVOICE
                        </div>
                      </div>
                    </div>

                    <Separator
                      style={{ borderColor: template.design?.colors?.border }}
                    />

                    {/* Company and Client Info */}
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <div
                          className="font-semibold text-sm"
                          style={{ color: template.design?.colors?.text }}
                        >
                          From:
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          <div className="font-semibold">Your Company Name</div>
                          <div>123 Business Street</div>
                          <div>City, State 12345</div>
                          <div>contact@company.com</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div
                          className="font-semibold text-sm"
                          style={{ color: template.design?.colors?.text }}
                        >
                          Bill To:
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          <div className="font-semibold">Client Name</div>
                          <div>456 Client Avenue</div>
                          <div>City, State 67890</div>
                          <div>client@email.com</div>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span
                          className="font-semibold"
                          style={{ color: template.design?.colors?.text }}
                        >
                          Invoice Number:
                        </span>{" "}
                        <span
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          INV-001
                        </span>
                      </div>
                      <div>
                        <span
                          className="font-semibold"
                          style={{ color: template.design?.colors?.text }}
                        >
                          Date:
                        </span>{" "}
                        <span
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          Jan 15, 2024
                        </span>
                      </div>
                      <div>
                        <span
                          className="font-semibold"
                          style={{ color: template.design?.colors?.text }}
                        >
                          Due Date:
                        </span>{" "}
                        <span
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          Feb 15, 2024
                        </span>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr
                            className="border-b-2"
                            style={{
                              borderColor: template.design?.colors?.border,
                              color: template.design?.colors?.text,
                            }}
                          >
                            <th className="text-left py-2 font-semibold">
                              Description
                            </th>
                            <th className="text-right py-2 font-semibold">
                              Qty
                            </th>
                            <th className="text-right py-2 font-semibold">
                              Unit Price
                            </th>
                            <th className="text-right py-2 font-semibold">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              desc: "Web Development Services",
                              qty: 40,
                              price: 100,
                              amount: 4000,
                            },
                            {
                              desc: "UI/UX Design",
                              qty: 20,
                              price: 80,
                              amount: 1600,
                            },
                            {
                              desc: "Consultation",
                              qty: 5,
                              price: 150,
                              amount: 750,
                            },
                          ].map((item, idx) => (
                            <tr
                              key={idx}
                              className="border-b"
                              style={{
                                borderColor: template.design?.colors.border,
                                color: template.design?.colors.textSecondary,
                              }}
                            >
                              <td className="py-2">{item.desc}</td>
                              <td className="text-right">{item.qty}</td>
                              <td className="text-right">${item.price}</td>
                              <td className="text-right">${item.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span
                            style={{
                              color: template.design?.colors?.textSecondary,
                            }}
                          >
                            Subtotal:
                          </span>
                          <span
                            style={{ color: template.design?.colors?.text }}
                          >
                            $6,350.00
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            style={{
                              color: template.design?.colors?.textSecondary,
                            }}
                          >
                            Tax (10%):
                          </span>
                          <span
                            style={{ color: template.design?.colors?.text }}
                          >
                            $635.00
                          </span>
                        </div>
                        <Separator
                          style={{
                            borderColor: template.design?.colors?.border,
                          }}
                        />
                        <div className="flex justify-between font-bold text-lg">
                          <span
                            style={{ color: template.design?.colors?.primary }}
                          >
                            Total:
                          </span>
                          <span
                            style={{ color: template.design?.colors?.primary }}
                          >
                            $6,985.00
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {template.defaults.notes && (
                      <div className="mt-6">
                        <div
                          className="font-semibold text-sm mb-2"
                          style={{ color: template.design?.colors?.text }}
                        >
                          Notes:
                        </div>
                        <p
                          className="text-sm"
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          {template.defaults.notes}
                        </p>
                      </div>
                    )}

                    {/* Terms */}
                    {template.defaults.terms && (
                      <div className="mt-4">
                        <div
                          className="font-semibold text-sm mb-2"
                          style={{ color: template.design?.colors?.text }}
                        >
                          Terms & Conditions:
                        </div>
                        <p
                          className="text-xs"
                          style={{
                            color: template.design?.colors?.textSecondary,
                          }}
                        >
                          {template.defaults.terms}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details" className="flex-1 p-6 m-0">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                {/* Color Scheme */}
                <div>
                  <h3 className="font-semibold mb-3">Color Scheme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(template.design?.colors).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: value }}
                          />
                          <div>
                            <div className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {value}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                {/* Typography */}
                <div>
                  <h3 className="font-semibold mb-3">Typography</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Heading Font:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.design?.fonts?.heading}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Body Font:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.design?.fonts?.body}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Layout */}
                <div>
                  <h3 className="font-semibold mb-3">Layout</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Style:</span>{" "}
                      <span className="text-sm text-muted-foreground capitalize">
                        {template.design?.layout || "classic"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Paper Size:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.design?.paperSize || "A4"}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Orientation:</span>{" "}
                      <span className="text-sm text-muted-foreground capitalize">
                        {template.design?.orientation || "portrait"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Advanced Options - NEW */}
                <div>
                  <h3 className="font-semibold mb-3">Advanced Options</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Borders:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.design?.advanced?.showBorders
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </div>
                    {template.design?.advanced?.showBorders && (
                      <div>
                        <span className="text-sm font-medium">
                          Border Style:
                        </span>{" "}
                        <span className="text-sm text-muted-foreground capitalize">
                          {template.design?.advanced?.borderStyle || "solid"}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium">Watermark:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.design?.advanced?.showWatermark
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </div>
                    {template.design?.advanced?.showWatermark && (
                      <div>
                        <span className="text-sm font-medium">
                          Watermark Text:
                        </span>{" "}
                        <span className="text-sm text-muted-foreground">
                          {template.design?.advanced?.watermarkText || "DRAFT"}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium">Page Numbers:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.design?.advanced?.showPageNumbers
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Usage Stats */}
                <div>
                  <h3 className="font-semibold mb-3">Usage Statistics</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Times Used:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {template.usageCount}
                      </span>
                    </div>
                    {template.lastUsedAt && (
                      <div>
                        <span className="text-sm font-medium">Last Used:</span>{" "}
                        <span className="text-sm text-muted-foreground">
                          {new Date(template.lastUsedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium">Created:</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-6 pt-4 border-t">
          <div className="flex gap-2 w-full justify-between">
            <div className="flex gap-2">
              {onDuplicate && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onDuplicate(template);
                    onClose();
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              )}
              {canEdit && onEdit && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onEdit(template);
                    onClose();
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {onSetDefault && !template.isDefault && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onSetDefault(template);
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Set as Default
                </Button>
              )}
              {onUse && (
                <Button
                  onClick={() => {
                    onUse(template);
                    onClose();
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
