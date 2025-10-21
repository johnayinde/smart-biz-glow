// src/components/common/AdvancedFilters.tsx
import { useState } from "react";
import { Calendar, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface AdvancedFilterValues {
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: any;
}

interface AdvancedFiltersProps {
  onApply: (filters: AdvancedFilterValues) => void;
  onClear: () => void;
  filterOptions?: {
    showDateRange?: boolean;
    showAmountRange?: boolean;
    showSort?: boolean;
    sortOptions?: { value: string; label: string }[];
    customFilters?: React.ReactNode;
  };
  currentFilters?: AdvancedFilterValues;
}

export const AdvancedFilters = ({
  onApply,
  onClear,
  filterOptions = {},
  currentFilters = {},
}: AdvancedFiltersProps) => {
  const {
    showDateRange = true,
    showAmountRange = true,
    showSort = true,
    sortOptions = [
      { value: "createdAt", label: "Date Created" },
      { value: "amount", label: "Amount" },
      { value: "status", label: "Status" },
    ],
    customFilters,
  } = filterOptions;

  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<AdvancedFilterValues>(currentFilters);

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    setOpen(false);
  };

  const activeFilterCount = Object.keys(currentFilters).filter(
    (key) => currentFilters[key] !== undefined && currentFilters[key] !== ""
  ).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Advanced Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Advanced Filters</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-2"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>

          <Separator />

          {/* Date Range Filter */}
          {showDateRange && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="start-date"
                    className="text-xs text-muted-foreground"
                  >
                    From
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={localFilters.startDate || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="end-date"
                    className="text-xs text-muted-foreground"
                  >
                    To
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={localFilters.endDate || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        endDate: e.target.value,
                      })
                    }
                    min={localFilters.startDate}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amount Range Filter */}
          {showAmountRange && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Amount Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="min-amount"
                    className="text-xs text-muted-foreground"
                  >
                    Min
                  </Label>
                  <Input
                    id="min-amount"
                    type="number"
                    placeholder="0.00"
                    value={localFilters.minAmount || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        minAmount: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="max-amount"
                    className="text-xs text-muted-foreground"
                  >
                    Max
                  </Label>
                  <Input
                    id="max-amount"
                    type="number"
                    placeholder="0.00"
                    value={localFilters.maxAmount || ""}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        maxAmount: parseFloat(e.target.value) || undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sort Options */}
          {showSort && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sort By</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={localFilters.sortBy || ""}
                  onValueChange={(value) =>
                    setLocalFilters({ ...localFilters, sortBy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.sortOrder || "desc"}
                  onValueChange={(value: "asc" | "desc") =>
                    setLocalFilters({ ...localFilters, sortOrder: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Custom Filters */}
          {customFilters && (
            <>
              <Separator />
              {customFilters}
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
