// src/components/templates/TemplateCard.tsx
import { useState } from "react";
import { Template } from "@/services/templateService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onView: (template: Template) => void;
  onEdit?: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete?: (template: Template) => void;
  onSetDefault?: (template: Template) => void;

  isSelected?: boolean;
  onSelect?: (template: Template) => void;
  showActions?: boolean;
}

export function TemplateCard({
  template,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onSetDefault,
  isSelected,
  onSelect,
  showActions = true,
}: TemplateCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const canEdit = !template.isSystemTemplate;
  const canDelete = !template.isSystemTemplate;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(template);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer",
          isSelected && "ring-2 ring-primary"
        )}
        onClick={() => onSelect?.(template)}
      >
        {/* Template Preview */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
          {/* Mock Invoice Preview */}
          <div className="h-full w-full bg-white dark:bg-gray-950 rounded-sm shadow-sm p-4 text-xs overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between pb-3 border-b"
              style={{ borderColor: template.design.colors.border }}
            >
              <div
                className={cn(
                  "font-bold text-lg",
                  template.design.logo.position === "center" && "mx-auto",
                  template.design.logo.position === "right" && "ml-auto"
                )}
                style={{ color: template.design.colors.primary }}
              >
                {template.design.logo.enabled ? "🏢 LOGO" : "INVOICE"}
              </div>
            </div>

            {/* Bill To Section */}
            <div className="mt-3 space-y-2">
              <div
                className="font-semibold"
                style={{ color: template.design.colors.text }}
              >
                Bill To:
              </div>
              <div
                className="text-xs space-y-0.5"
                style={{ color: template.design.colors.textSecondary }}
              >
                <div>Client Name</div>
                <div>123 Street Name</div>
                <div>City, State 12345</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-4 space-y-2">
              <div
                className="flex justify-between font-semibold pb-1 border-b"
                style={{
                  color: template.design.colors.text,
                  borderColor: template.design.colors.border,
                }}
              >
                <span>Description</span>
                <span>Amount</span>
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between text-xs"
                  style={{ color: template.design.colors.textSecondary }}
                >
                  <span>Item {i}</span>
                  <span>$100</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-2 border-t">
              <div
                className="flex justify-between font-bold"
                style={{ color: template.design.colors.primary }}
              >
                <span>Total</span>
                <span>$300</span>
              </div>
            </div>
          </div>

          {/* Overlay Actions - Show on hover */}
          {showActions && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(template);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              {canEdit && onEdit && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(template);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {template.isDefault && (
              <Badge variant="default" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Default
              </Badge>
            )}
            {template.isSystemTemplate && (
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
            )}
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {template.name}
              </h3>
              {template.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {template.description}
                </p>
              )}
              {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Actions Menu */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(template)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(template)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {canEdit && onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(template)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onSetDefault && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onSetDefault(template)}>
                        {template.isDefault ? (
                          <>
                            <StarOff className="h-4 w-4 mr-2" />
                            Remove Default
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Set as Default
                          </>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}
                  {canDelete && onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Usage Stats */}
          {template.usageCount > 0 && (
            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
              Used {template.usageCount}{" "}
              {template.usageCount === 1 ? "time" : "times"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{template.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
