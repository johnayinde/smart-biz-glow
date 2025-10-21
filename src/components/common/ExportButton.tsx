// src/components/common/ExportButton.tsx
import { useState } from "react";
import { Download, FileDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format as formatDate } from "date-fns";

export type ExportType = "invoices" | "payments" | "clients";
export type ExportFormat = "csv" | "pdf";

interface ExportButtonProps {
  type: ExportType;
  onExport: (filters: ExportFilters) => Promise<void>;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  label?: string;
}

export interface ExportFilters {
  startDate?: string;
  endDate?: string;
  format?: ExportFormat;
}

export const ExportButton = ({
  type,
  onExport,
  variant = "outline",
  size = "default",
  className = "",
  disabled = false,
  label,
}: ExportButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const typeLabels = {
    invoices: "Invoices",
    payments: "Payments",
    clients: "Clients",
  };

  const handleQuickExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await onExport({ format });
      toast({
        title: "success",
        description: `Your ${typeLabels[
          type
        ].toLowerCase()} are being exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "error",
        description:
          error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCustomExport = async (format: ExportFormat) => {
    if (!startDate || !endDate) {
      toast({
        title: "error",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      await onExport({
        startDate,
        endDate,
        format,
      });
      toast({
        title: "Success",
        description: `Your ${typeLabels[type].toLowerCase()} from ${formatDate(
          new Date(startDate),
          "MMM dd, yyyy"
        )} to ${formatDate(
          new Date(endDate),
          "MMM dd, yyyy"
        )} are being exported.`,
      });
      setDialogOpen(false);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            disabled={disabled || isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {label || `Export ${typeLabels[type]}`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Quick Export</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleQuickExport("csv")}
            disabled={isExporting}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export All as CSV
          </DropdownMenuItem>
          {type === "invoices" && (
            <DropdownMenuItem
              onClick={() => handleQuickExport("pdf")}
              disabled={isExporting}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export All as PDF
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Custom Export</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Select Date Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export {typeLabels[type]}</DialogTitle>
            <DialogDescription>
              Select a date range to export your{" "}
              {typeLabels[type].toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCustomExport("csv")}
              disabled={isExporting || !startDate || !endDate}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            {type === "invoices" && (
              <Button
                onClick={() => handleCustomExport("pdf")}
                disabled={isExporting || !startDate || !endDate}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
