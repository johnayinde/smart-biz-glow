// src/pages/templates/index.tsx - FIXED VERSION
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTemplates,
  useDeleteTemplate,
  useDuplicateTemplate,
  useSetDefaultTemplate,
} from "@/hooks/queries/use-template-query";
import { Template } from "@/services/templateService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import {
  Search,
  Plus,
  Palette,
  Grid3x3,
  List,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const navigate = useNavigate();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "usageCount">(
    "createdAt"
  );
  const [page, setPage] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Build filters
  const filters = {
    page,
    limit: 12,
    search: searchTerm || undefined,
    sortBy,
    sortOrder: "desc" as const,
    isSystemTemplate:
      activeTab === "system"
        ? true
        : activeTab === "my-templates"
        ? false
        : undefined,
  };

  // Queries
  const { data, isLoading, error, isFetching } = useTemplates(filters);
  const deleteTemplateMutation = useDeleteTemplate();
  const duplicateTemplateMutation = useDuplicateTemplate();
  const setDefaultTemplateMutation = useSetDefaultTemplate();

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleViewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleEditTemplate = (template: Template) => {
    navigate(`/templates/builder/${template.id}`);
  };

  const handleDuplicateTemplate = (template: Template) => {
    duplicateTemplateMutation.mutate(template.id);
  };

  const handleDeleteTemplate = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteTemplateMutation.mutate(templateToDelete.id, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          setTemplateToDelete(null);
        },
      });
    }
  };

  const handleSetDefaultTemplate = (template: Template) => {
    setDefaultTemplateMutation.mutate(template.id);
  };

  const handleUseTemplate = (template: Template) => {
    navigate(`/invoices/new?templateId=${template.id}`);
  };

  const handleCreateNew = () => {
    navigate("/templates/builder");
  };

  const templates = data?.data || [];
  const totalPages = data?.meta.totalPages || 1;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Palette className="h-8 w-8" />
            Invoice Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage professional invoice templates for your business
          </p>
        </div>
        <Button onClick={handleCreateNew} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort By */}
            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="usageCount">Usage Count</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-1 border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="system">System Templates</TabsTrigger>
        </TabsList>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load templates. {error.message}
              <Button
                variant="outline"
                size="sm"
                className="ml-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6">
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}
            >
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <div className="aspect-[3/4] bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Templates Content */}
        {!isLoading && !error && (
          <TabsContent value={activeTab} className="mt-6">
            {/* Empty State */}
            {templates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {searchTerm
                      ? "No templates found"
                      : activeTab === "my-templates"
                      ? "No custom templates yet"
                      : "No templates available"}
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    {searchTerm
                      ? "Try adjusting your search or filters to find what you're looking for"
                      : activeTab === "my-templates"
                      ? "Create your first custom template to get started with personalized invoices"
                      : "Get started by creating a new template or exploring system templates"}
                  </p>
                  {activeTab === "my-templates" && !searchTerm && (
                    <Button onClick={handleCreateNew} size="lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Template
                    </Button>
                  )}
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Templates Grid/List */}
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  )}
                >
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onView={() => handleViewTemplate(template)}
                      onEdit={
                        !template.isSystemTemplate
                          ? () => handleEditTemplate(template)
                          : undefined
                      }
                      onDuplicate={() => handleDuplicateTemplate(template)}
                      onDelete={
                        !template.isSystemTemplate
                          ? () => handleDeleteTemplate(template)
                          : undefined
                      }
                      onSetDefault={
                        !template.isDefault
                          ? () => handleSetDefaultTemplate(template)
                          : undefined
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isFetching}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages || isFetching}
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Loading indicator for pagination */}
                {isFetching && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          open={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onEdit={
            !previewTemplate.isSystemTemplate
              ? () => handleEditTemplate(previewTemplate)
              : undefined
          }
          onDuplicate={() => handleDuplicateTemplate(previewTemplate)}
          onSetDefault={
            !previewTemplate.isDefault
              ? () => handleSetDefaultTemplate(previewTemplate)
              : undefined
          }
          onUse={() => handleUseTemplate(previewTemplate)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This
              action cannot be undone.
              {templateToDelete?.usageCount > 0 && (
                <p className="mt-2 text-orange-600 font-medium">
                  Warning: This template has been used{" "}
                  {templateToDelete.usageCount} time
                  {templateToDelete.usageCount > 1 ? "s" : ""}. Existing
                  invoices will not be affected.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setTemplateToDelete(null);
              }}
              disabled={deleteTemplateMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteTemplateMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteTemplateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Template"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
