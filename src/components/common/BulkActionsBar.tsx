// src/components/common/BulkActionsBar.tsx
import { Trash2, Send, Check, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
  onClick: (selectedIds: string[]) => void;
}

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
  selectedIds: string[];
}

export const BulkActionsBar = ({
  selectedCount,
  totalCount,
  onClearSelection,
  actions,
  selectedIds,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  // Show first 2 actions as buttons, rest in dropdown
  const primaryActions = actions.slice(0, 2);
  const moreActions = actions.slice(2);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border shadow-lg rounded-lg px-4 py-3 flex items-center gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {selectedCount} selected
          </Badge>
          <span className="text-sm text-muted-foreground">of {totalCount}</span>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Primary Actions */}
        <div className="flex items-center gap-2">
          {primaryActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "default"}
              size="sm"
              onClick={() => action.onClick(selectedIds)}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}

          {/* More Actions Dropdown */}
          {moreActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moreActions.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => action.onClick(selectedIds)}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};
