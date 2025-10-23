// src/pages/templates/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTemplates,
  useDeleteTemplate,
  useDuplicateTemplate,
  useSetDefaultTemplate,
} from "@/hooks/queries/use-template-query";
import { Template, TemplateFilters } from "@/services/templateService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import {
  Plus,
  Search,
  Grid3x3,
  List,
  AlertCircle,
  Palette,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list";
type TabValue = "all" | "my-templates" | "system";

export default function InvoiceTemplates() {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "createdAt" | "usageCount" | "lastUsedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [page, setPage] = useState(1);

  // Build filters based on active tab
  const filters: TemplateFilters = {
    page,
    limit: 12,
    search: searchTerm || undefined,
    sortBy,
    sortOrder,
    isSystemTemplate:
      activeTab === "system"
        ? true
        : activeTab === "my-templates"
        ? false
        : undefined,
  };
  console.log(filters);

  // Queries
  const { data, isLoading, error } = useTemplates(filters);
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
    deleteTemplateMutation.mutate(template.id);
  };

  const handleSetDefaultTemplate = (template: Template) => {
    setDefaultTemplateMutation.mutate(template.id);
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to create invoice with template pre-selected
    navigate(`/invoices/new?templateId=${template.id}`);
  };

  const handleCreateNew = () => {
    navigate("/templates/builder");
  };
  console.log(data);

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
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="usageCount">Most Used</SelectItem>
                <SelectItem value="lastUsedAt">Recently Used</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select
              value={sortOrder}
              onValueChange={(value: any) => setSortOrder(value)}
            >
              <SelectTrigger className="w-full lg:w-[140px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-1 border rounded-lg p-1">
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
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
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
              Failed to load templates. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div
            className={cn(
              "mt-6",
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            )}
          >
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <div className="aspect-[3/4] bg-muted" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Templates Grid/List */}
        {!isLoading && !error && (
          <TabsContent value={activeTab} className="mt-6">
            {templates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No templates found
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-sm">
                    {activeTab === "my-templates"
                      ? "Create your first custom template to get started"
                      : "Try adjusting your search or filters"}
                  </p>
                  {activeTab === "my-templates" && (
                    <Button onClick={handleCreateNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
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
                      onView={handleViewTemplate}
                      onEdit={handleEditTemplate}
                      onDuplicate={handleDuplicateTemplate}
                      onDelete={handleDeleteTemplate}
                      onSetDefault={handleSetDefaultTemplate}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={handleUseTemplate}
        onEdit={handleEditTemplate}
        onDuplicate={handleDuplicateTemplate}
        onSetDefault={handleSetDefaultTemplate}
      />
    </div>
  );
}
